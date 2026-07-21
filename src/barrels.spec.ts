import * as Casl from './casl';
import * as Decorators from './decorators';
import * as Params from './decorators/params';
import * as Properties from './decorators/properties';
import * as QueryDecorators from './decorators/query';
import * as Responses from './decorators/responses';
import * as Dto from './dto';
import * as Fields from './fields';
import * as Pagination from './pagination';
import * as Pipes from './pipes';
import * as QueryService from './query-service';
import * as Util from './util';
import * as ObjectUtil from './util/object';
import * as QueryUtil from './util/query';

describe('module barrels', () => {
  it('expose their documented runtime helpers', () => {
    for (const module of [
      Casl,
      Decorators,
      Params,
      Properties,
      QueryDecorators,
      Responses,
      Dto,
      Fields,
      Pagination,
      Pipes,
      QueryService,
      Util,
      ObjectUtil,
      QueryUtil,
    ]) {
      expect(Object.keys(module).length).toBeGreaterThan(0);
    }
  });
});
