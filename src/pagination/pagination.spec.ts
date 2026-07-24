import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PageMetaDTO, PageOptionsDTO, PaginatedDTO } from './index.js';

describe('pagination DTOs', () => {
  it('uses default page options', () => {
    const options = new PageOptionsDTO();

    expect(options.page).toBe(1);
    expect(options.perPage).toBe(10);
  });

  it('transforms and validates page options', () => {
    const options = plainToInstance(PageOptionsDTO, { page: '2', perPage: '25' });

    expect(options.page).toBe(2);
    expect(options.perPage).toBe(25);
    expect(validateSync(options)).toEqual([]);
  });

  it('rejects invalid page options', () => {
    const options = plainToInstance(PageOptionsDTO, { page: '0', perPage: '1001' });

    expect(validateSync(options)).toHaveLength(2);
  });

  it('creates page metadata', () => {
    expect({ ...new PageMetaDTO({ itemCount: 21, pageOptions: { page: 2, perPage: 10 } }) }).toEqual({
      page: 2,
      perPage: 10,
      itemCount: 21,
      pageCount: 3,
      hasPrevPage: true,
      hasNextPage: true,
    });
  });

  it('creates empty page metadata', () => {
    expect({ ...new PageMetaDTO({ itemCount: 0, pageOptions: { page: 1, perPage: 10 } }) }).toEqual({
      page: 1,
      perPage: 10,
      itemCount: 0,
      pageCount: 0,
      hasPrevPage: false,
      hasNextPage: false,
    });
  });

  it('creates paginated DTOs', () => {
    const meta = new PageMetaDTO({ itemCount: 1, pageOptions: { page: 1, perPage: 10 } });

    expect({ ...new PaginatedDTO([{ id: '1' }], meta) }).toEqual({
      items: [{ id: '1' }],
      meta,
    });
  });

  it('keeps Swagger response type factories executable', () => {
    const itemsMetadata = Reflect.getMetadata('swagger/apiModelProperties', PaginatedDTO.prototype, 'items') as {
      type: () => unknown;
    };
    const metaMetadata = Reflect.getMetadata('swagger/apiModelProperties', PaginatedDTO.prototype, 'meta') as {
      type: () => unknown;
    };

    expect(itemsMetadata.type()).toEqual([Object]);
    expect(metaMetadata.type()).toBe(PageMetaDTO);
  });
});
