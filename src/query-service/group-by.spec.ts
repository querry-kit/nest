import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { QueryService as CoreQueryService } from '../core/query.service.js';
import { GroupByDTO, type BaseDelegate } from '../dto/index.js';
import { QueryService } from './query.service.js';

const noop = async () => [];
const base: BaseDelegate = {
  create: noop,
  findMany: noop,
  updateMany: noop,
  update: noop,
  upsert: noop,
  deleteMany: noop,
  delete: noop,
  findFirst: noop,
  findUnique: noop,
  aggregate: noop,
  count: noop,
};

describe.each([QueryService, CoreQueryService])('groupBy %p', (Service) => {
  it('scopes, parses and serializes aggregate queries', async () => {
    let received: unknown;
    const delegate = {
      ...base,
      groupBy: async (args: unknown) => {
        received = args;
        return [{ status: 'open', _sum: { cost: { toNumber: () => 12 } } }];
      },
    };
    const service = new Service(delegate, { subject: 'Task', accessibleWhere: () => ({ tenantId: 'a' }) });
    expect(
      await service.groupBy(
        {
          by: ['status'],
          where: { active: 'true' },
          having: { cost: { _sum: { gt: '1' } } },
          orderBy: { status: 'asc' },
          take: 2,
          skip: 0,
          _sum: { cost: true },
        },
        {},
      ),
    ).toEqual([{ status: 'open', _sum: { cost: 12 } }]);
    expect(received).toEqual({
      by: ['status'],
      where: { AND: [{ tenantId: 'a' }, { active: true }] },
      having: { cost: { _sum: { gt: 1 } } },
      orderBy: { status: 'asc' },
      take: 2,
      skip: 0,
      _sum: { cost: true },
    });
  });

  it('supports existing delegates and reports missing grouping capability', async () => {
    await expect(new Service(base).groupBy({ by: ['status'] })).rejects.toThrow(NotImplementedException);
  });

  it.each([
    null,
    { by: [] },
    { by: ['a', 'a'] },
    { by: ['a.b'] },
    { by: [1] },
    { by: ['a'], take: 1 },
    { by: ['a'], skip: 0 },
    { by: ['a'], take: 0 },
    { by: ['a'], skip: -1 },
    { by: ['a'], take: 1.5 },
    { by: ['a'], select: {} },
  ])('rejects invalid options %p', async (options) => {
    await expect(new Service(base).groupBy(options as never)).rejects.toThrow(BadRequestException);
  });

  it('maps forbidden and unexpected failures', async () => {
    const service = new Service({
      ...base,
      groupBy: async () => {
        throw new Error('failure');
      },
    });
    await expect(service.groupBy({ by: ['status'] })).rejects.toThrow(InternalServerErrorException);
    const denied = new Service(base, {
      subject: 'Task',
      accessibleWhere: () => {
        throw Object.assign(new Error('denied'), { name: 'ForbiddenError' });
      },
    });
    await expect(denied.groupBy({ by: ['status'] }, {})).rejects.toThrow(ForbiddenException);
    const invalid = new Service({
      ...base,
      groupBy: async () => {
        throw Object.assign(new Error('invalid'), { name: 'PrismaClientValidationError' });
      },
    });
    await expect(invalid.groupBy({ by: ['status'] })).rejects.toThrow(BadRequestException);
  });

  it('preserves JSON key types for group and leaf queries when opted in', async () => {
    const calls: unknown[] = [];
    const service = new Service(
      {
        ...base,
        groupBy: async (args: unknown) => {
          calls.push(args);
          return [];
        },
        findMany: async (args: unknown) => {
          calls.push(args);
          return [];
        },
      },
      { preserveJsonWhereTypes: true },
    );
    const where = JSON.stringify({ code: '001', label: 'true', other: 'null', count: 1 });
    await service.groupBy({ by: ['code'], where });
    await service.findMany({ where });
    for (const args of calls) expect(args).toEqual(expect.objectContaining({ where: JSON.parse(where) }));
  });
});

it('validates DTO keys and transforms pagination strings', () => {
  expect(validateSync(plainToInstance(GroupByDTO, { by: ['status'], take: '2', skip: '0' }))).toEqual([]);
  expect(validateSync(plainToInstance(GroupByDTO, { by: [], take: '-1' })).length).toBeGreaterThan(0);
});

it.each(['invalid', 'null', '[]'])('rejects invalid typed JSON where %s', async (where) => {
  const service = new CoreQueryService(base, { preserveJsonWhereTypes: true });
  await expect(service.groupBy({ by: ['a'], where })).rejects.toThrow(BadRequestException);
});
