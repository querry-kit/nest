import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AggregateDTO } from './aggregate.dto.js';
import { CountDTO } from './count.dto.js';
import { FindByIdDTO } from './find-by-id.dto.js';
import { FindManyDTO } from './find-many.dto.js';
import { FindOneDTO } from './find-one.dto.js';
import { FindUniqueDTO } from './find-unique.dto.js';
import { QueryDTO } from './query.dto.js';

describe('query DTOs', () => {
  it('can instantiate every public query DTO', () => {
    const aggregate = new AggregateDTO<never>();
    const count = new CountDTO<never>();
    const findById = new FindByIdDTO<never>();
    const findMany = new FindManyDTO<never>();
    const findOne = new FindOneDTO<never>();
    const findUnique = new FindUniqueDTO<never>();
    const query = new QueryDTO<never>();

    expect([aggregate, count, findById, findMany, findOne, findUnique, query]).toHaveLength(7);
    expect(findMany).toBeInstanceOf(FindOneDTO);
    expect(findUnique).toBeInstanceOf(FindByIdDTO);
    expect(query.page).toBe(1);
    expect(query.perPage).toBe(10);
  });

  it('transforms and validates documented scalar query options', () => {
    const aggregate = plainToInstance(AggregateDTO, { take: '3', skip: '-1' });
    const findById = plainToInstance(FindByIdDTO, { fields: 1 });
    const findMany = plainToInstance(FindManyDTO, { take: '2', skip: '-1' });
    const query = plainToInstance(QueryDTO, { fields: 1 });

    expect(aggregate.take).toBe(3);
    expect(validateSync(aggregate)).toHaveLength(1);
    expect(validateSync(new CountDTO())).toEqual([]);
    expect(validateSync(findById)).toHaveLength(1);
    expect(findMany.take).toBe(2);
    expect(validateSync(findMany)).toHaveLength(1);
    expect(validateSync(query)).toHaveLength(1);
  });
});
