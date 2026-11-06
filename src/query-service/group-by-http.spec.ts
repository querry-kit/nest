import type { INestApplication } from '@nestjs/common';
import { Controller, Get, Module, Query, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import qs from 'qs';
import { QueryService } from '../core/query.service.js';
import { GroupByDTO, QueryDTO, type BaseDelegateTypeMap } from '../dto/index.js';
import { QueryTransformPipe } from '../pipes/query-transform.pipe.js';

const rows = [
  { id: '1', tenant: 'a', status: '001' },
  { id: '2', tenant: 'a', status: '001' },
  { id: '3', tenant: 'b', status: 'secret' },
];
const matches = (row: (typeof rows)[number], input: unknown): boolean => {
  const where = input as Record<string, unknown>;
  return Object.entries(where).every(([key, value]) =>
    key === 'AND'
      ? (value as unknown[]).every((part) => matches(row, part))
      : row[key as keyof typeof row] ===
        (typeof value === 'object' && value !== null ? (value as { equals: unknown }).equals : value),
  );
};
const noop = async () => undefined;
const service = new QueryService(
  {
    create: noop,
    updateMany: noop,
    update: noop,
    upsert: noop,
    deleteMany: noop,
    delete: noop,
    findFirst: noop,
    findUnique: noop,
    aggregate: noop,
    findMany: async (args: { where: unknown }) => rows.filter((row) => matches(row, args.where)),
    count: async (args: { where: unknown }) => rows.filter((row) => matches(row, args.where)).length,
    groupBy: async (args: Record<string, unknown>) => {
      const filtered = rows.filter((row) => matches(row, args.where));
      return [...new Set(filtered.map((row) => row.status))].map((status) => ({
        status,
        _count: { _all: filtered.filter((row) => row.status === status).length },
      }));
    },
  },
  { subject: 'Task', accessibleWhere: () => ({ tenant: 'a' }), preserveJsonWhereTypes: true },
);
class TaskGroupDTO extends GroupByDTO<BaseDelegateTypeMap> {}
class TaskQueryDTO extends QueryDTO<BaseDelegateTypeMap> {}
@Controller('tasks')
class TasksController {
  @Get('group-by')
  group(@Query() query: TaskGroupDTO) {
    return service.groupBy(query, {});
  }
  @Get()
  async list(@Query() query: TaskQueryDTO) {
    const result = await service.query(query, {});
    return { items: result.items, meta: result.pageMeta };
  }
}
@Module({ controllers: [TasksController] })
class TestModule {}

let app: INestApplication;
let origin: string;
beforeAll(async () => {
  app = await NestFactory.create(TestModule, { logger: false });
  app
    .getHttpAdapter()
    .getInstance()
    .set('query parser', (value: string) => qs.parse(value));
  app.useGlobalPipes(
    new QueryTransformPipe({ preserveJsonWhereTypes: true }),
    new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.listen(0, '127.0.0.1');
  origin = await app.getUrl();
});
afterAll(async () => {
  await app.close();
});

it('round-trips typed keys through HTTP validation and applies identical tenant constraints', async () => {
  const groups = await fetch(
    `${origin}/tasks/group-by${qs.stringify({ by: ['status'], where: JSON.stringify({}), _count: { _all: true }, orderBy: { status: 'asc' }, take: 26 }, { addQueryPrefix: true })}`,
  );
  expect(groups.status).toBe(200);
  expect(await groups.json()).toEqual([{ status: '001', _count: { _all: 2 } }]);
  const items = await fetch(
    `${origin}/tasks${qs.stringify({ where: JSON.stringify({ status: { equals: '001' } }), page: 1, perPage: 25 }, { addQueryPrefix: true })}`,
  );
  const result = (await items.json()) as { items: typeof rows; meta: { itemCount: number } };
  expect(items.status).toBe(200);
  expect(result.items).toHaveLength(2);
  expect(result.meta.itemCount).toBe(2);
  const denied = await fetch(
    `${origin}/tasks/group-by${qs.stringify({ by: ['status'], where: JSON.stringify({ tenant: 'b' }) }, { addQueryPrefix: true })}`,
  );
  expect(await denied.json()).toEqual([]);
});

it.each([
  { by: [] },
  { by: ['status'], select: {} },
  { by: ['status'], take: 1 },
  { by: ['status'], where: 'invalid' },
])('rejects invalid HTTP grouping %p', async (query) => {
  // Empty objects are omitted by qs, so explicitly send an unsupported scalar for that case.
  const payload = 'select' in query ? { ...query, select: 'id' } : query;
  const response = await fetch(`${origin}/tasks/group-by${qs.stringify(payload, { addQueryPrefix: true })}`);
  expect(response.status).toBe(400);
});

it('publishes required group keys and aggregate options in OpenAPI', () => {
  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Grouping fixture').setVersion('1').build(),
  );
  const parameters = doc.paths['/tasks/group-by']?.get?.parameters as Array<{ name: string; required?: boolean }>;
  expect(parameters.find((parameter) => parameter.name === 'by')?.required).toBe(true);
  expect(parameters.map((parameter) => parameter.name)).toEqual(
    expect.arrayContaining(['having', '_count', 'orderBy', 'take']),
  );
});
