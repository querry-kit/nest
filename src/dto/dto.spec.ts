import { AggregateDTO, CountDTO, FindByIdDTO, FindManyDTO, FindOneDTO, FindUniqueDTO, QueryDTO } from './index';

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
});
