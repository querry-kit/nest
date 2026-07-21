import { BadRequestException, HttpException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { QueryService } from './query.service.js';

class TestDelegate {
  calls: unknown[] = [];
  data = [{ id: '1', name: 'Ada' }];
  fail?: Error;

  async create(args: unknown) {
    return args;
  }

  async findMany(args: unknown) {
    this.calls.push(['findMany', args]);
    if (this.fail) {
      throw this.fail;
    }
    return this.data;
  }

  async updateMany(args: unknown) {
    return args;
  }

  async update(args: unknown) {
    return args;
  }

  async upsert(args: unknown) {
    return args;
  }

  async deleteMany(args: unknown) {
    return args;
  }

  async delete(args: unknown) {
    return args;
  }

  async findFirst(args: unknown) {
    this.calls.push(['findFirst', args]);
    if (this.fail) {
      throw this.fail;
    }
    return this.data[0] ?? null;
  }

  async findUnique(args: unknown) {
    this.calls.push(['findUnique', args]);
    return this.data[0] ?? null;
  }

  async aggregate(args: unknown) {
    this.calls.push(['aggregate', args]);
    return { total: { toNumber: () => 7 } };
  }

  async count(args: unknown) {
    this.calls.push(['count', args]);
    if (this.fail) {
      throw this.fail;
    }
    return this.data.length;
  }
}

describe('QueryService', () => {
  it('finds one record and parses query options', async () => {
    const delegate = new TestDelegate();
    const service = new QueryService(delegate);

    await expect(service.findOne({ where: { active: 'true' }, orderBy: { name: 'asc' } } as never)).resolves.toEqual({
      id: '1',
      name: 'Ada',
    });
    expect(delegate.calls.at(-1)).toEqual([
      'findFirst',
      {
        select: undefined,
        include: undefined,
        where: { active: true },
        orderBy: { name: 'asc' },
        cursor: undefined,
        distinct: undefined,
      },
    ]);
  });

  it('finds many records and passes pagination args', async () => {
    const delegate = new TestDelegate();
    const service = new QueryService(delegate);

    await expect(service.findMany({ take: 1, skip: 0 } as never)).resolves.toEqual([{ id: '1', name: 'Ada' }]);
    expect(delegate.calls.at(-1)).toEqual([
      'findMany',
      {
        select: undefined,
        include: undefined,
        where: {},
        orderBy: undefined,
        cursor: undefined,
        take: 1,
        skip: 0,
        distinct: undefined,
      },
    ]);
  });

  it('finds by id and unique records', async () => {
    const delegate = new TestDelegate();
    const service = new QueryService(delegate);

    await expect(service.findById('1')).resolves.toEqual({ id: '1', name: 'Ada' });
    await expect(service.findUnique({ where: { id: '1' } } as never)).resolves.toEqual({ id: '1', name: 'Ada' });
  });

  it('uses findFirst for findUnique when ability is provided', async () => {
    const delegate = new TestDelegate();
    const service = new QueryService(delegate, {
      subject: 'Book',
      accessibleWhere: () => ({ organizationId: 'org' }),
    });

    await service.findUnique({ where: { id: '1' } } as never, { can: true });

    expect(delegate.calls.at(-1)).toEqual([
      'findFirst',
      {
        where: { AND: [{ organizationId: 'org' }, { id: 1 }] },
        select: undefined,
        include: undefined,
      },
    ]);
  });

  it('aggregates, counts and queries paginated records', async () => {
    const delegate = new TestDelegate();
    const service = new QueryService(delegate);

    await expect(service.aggregate({ where: { active: 'true' }, _sum: { value: true } } as never)).resolves.toEqual({
      total: 7,
    });
    await expect(service.count({ where: { active: 'true' } } as never)).resolves.toBe(1);

    const result = await service.query({ page: 3, perPage: 10, where: { active: 'true' } } as never);

    expect(result.items).toEqual([{ id: '1', name: 'Ada' }]);
    expect(result.pageMeta.page).toBe(3);
    expect(result.pageMeta.itemCount).toBe(1);
    expect(delegate.calls.at(-1)).toEqual([
      'findMany',
      expect.objectContaining({ skip: 20, take: 10, where: { active: true } }),
    ]);
  });

  it('uses default pagination when query page options are omitted', async () => {
    const delegate = new TestDelegate();
    const service = new QueryService(delegate);

    const result = await service.query({ where: { active: 'true' } } as never);

    expect(result.pageMeta.page).toBe(1);
    expect(result.pageMeta.perPage).toBe(10);
    expect(delegate.calls.at(-1)).toEqual([
      'findMany',
      expect.objectContaining({ skip: 0, take: 10, where: { active: true } }),
    ]);
  });

  it('merges access-control where clauses', async () => {
    const delegate = new TestDelegate();
    const service = new QueryService(delegate, {
      subject: 'Book',
      accessibleWhere: () => ({ organizationId: 'org' }),
    });

    await service.findMany({ where: { active: 'true' } } as never, { can: true });

    expect(delegate.calls.at(-1)).toEqual([
      'findMany',
      expect.objectContaining({
        where: { AND: [{ organizationId: 'org' }, { active: true }] },
      }),
    ]);
  });

  it('does not merge access-control filters without resolver or subject', async () => {
    const delegateWithoutResolver = new TestDelegate();
    const serviceWithoutResolver = new QueryService(delegateWithoutResolver, { subject: 'Book' });

    await serviceWithoutResolver.findMany({ where: { active: 'true' } } as never, { can: true });

    expect(delegateWithoutResolver.calls.at(-1)).toEqual([
      'findMany',
      expect.objectContaining({
        where: { active: true },
      }),
    ]);

    const delegateWithoutSubject = new TestDelegate();
    const serviceWithoutSubject = new QueryService(delegateWithoutSubject, {
      accessibleWhere: () => ({ organizationId: 'org' }),
    });

    await serviceWithoutSubject.findMany({ where: { active: 'true' } } as never, { can: true });

    expect(delegateWithoutSubject.calls.at(-1)).toEqual([
      'findMany',
      expect.objectContaining({
        where: { active: true },
      }),
    ]);
  });

  it('throws not found errors for missing records', async () => {
    const delegate = new TestDelegate();
    delegate.data = [];
    const service = new QueryService(delegate);

    await expect(service.findById('missing')).rejects.toThrow(NotFoundException);
    await expect(service.findUnique({ where: { id: 'missing' } } as never)).rejects.toThrow(NotFoundException);
  });

  it('maps Prisma-like errors for findById', async () => {
    const delegate = new TestDelegate();
    const errorLogger = { error: jest.fn() };
    const service = new QueryService(delegate, { errorLogger });

    const validation = new Error('invalid');
    validation.name = 'PrismaClientValidationError';
    delegate.fail = validation;
    await expect(service.findById('1')).rejects.toThrow(BadRequestException);

    const known = Object.assign(new Error('head\n\n\nKnown data error'), { code: 'P2002', meta: { target: ['id'] } });
    delegate.fail = known;
    await expect(service.findById('1')).rejects.toThrow(BadRequestException);

    const knownWithoutNestedMessage = Object.assign(new Error('Known data error'), { code: 'P2003' });
    delegate.fail = knownWithoutNestedMessage;
    await expect(service.findById('1')).rejects.toThrow(BadRequestException);

    const httpError = new HttpException('custom', 418);
    delegate.fail = httpError;
    await expect(service.findById('1')).rejects.toBe(httpError);

    const unknown = new Error('unknown');
    delegate.fail = unknown;
    await expect(service.findById('1')).rejects.toThrow(InternalServerErrorException);
    expect(errorLogger.error).toHaveBeenCalledWith(unknown);
  });

  it('maps unknown errors without requiring an error logger', async () => {
    const delegate = new TestDelegate();
    const service = new QueryService(delegate);

    delegate.fail = new Error('unknown');

    await expect(service.findById('1')).rejects.toThrow(InternalServerErrorException);
  });

  it('maps forbidden-like query errors', async () => {
    const delegate = new TestDelegate();
    const service = new QueryService(delegate, {
      subject: 'Book',
      accessibleWhere: () => {
        const error = new Error('forbidden');
        error.name = 'ForbiddenError';
        throw error;
      },
    });

    await expect(service.query({ page: 1, perPage: 10 } as never, {})).rejects.toThrow('Insufficient permissions');
  });

  it('maps ForbiddenErrorType query errors', async () => {
    const delegate = new TestDelegate();
    const service = new QueryService(delegate, {
      subject: 'Book',
      accessibleWhere: () => {
        const error = new Error('forbidden');
        error.name = 'ForbiddenErrorType';
        throw error;
      },
    });

    await expect(service.query({ page: 1, perPage: 10 } as never, {})).rejects.toThrow('Insufficient permissions');
  });

  it('rethrows non-forbidden query errors', async () => {
    const delegate = new TestDelegate();
    const service = new QueryService(delegate);
    const error = new Error('count failed');
    delegate.fail = error;

    await expect(service.query({ page: 1, perPage: 10 } as never)).rejects.toBe(error);
  });
});
