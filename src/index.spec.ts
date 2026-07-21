import * as QueryKitNest from './index';

describe('public API', () => {
  it('exports the main helpers from the package root', () => {
    expect(QueryKitNest.Fields).toBeDefined();
    expect(QueryKitNest.FieldsParser).toBeDefined();
    expect(QueryKitNest.ResourceQuery).toBeDefined();
    expect(QueryKitNest.QueryService).toBeDefined();
    expect(QueryKitNest.parseObject).toBeDefined();
    expect(QueryKitNest.filterCaslFields).toBeDefined();
  });
});
