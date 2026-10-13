import {
  parseObject,
  serializeDecimalValues
} from "./chunk-5E262EQA.js";
import {
  PageMetaDTO
} from "./chunk-V7UTPUGM.js";
import {
  __decorateClass
} from "./chunk-BRKEJJFQ.js";

// src/query-service/query.service.ts
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

// src/util/query/parse-query-object.ts
function parseQueryObject(value) {
  return parseObject(value);
}

// src/query-service/errors/handle-query-service-error.ts
import { BadRequestException, HttpException, InternalServerErrorException } from "@nestjs/common";

// src/query-service/errors/is-known-request-error-like.ts
function isKnownRequestErrorLike(error) {
  return error instanceof Error && typeof error.code === "string";
}

// src/query-service/errors/is-validation-error-like.ts
function isValidationErrorLike(error) {
  return error instanceof Error && error.name === "PrismaClientValidationError";
}

// src/query-service/errors/handle-query-service-error.ts
function handleQueryServiceError(error, options, args, errorLogger) {
  if (isValidationErrorLike(error)) {
    throw new BadRequestException({ message: "Invalid query.", options, parsedArgs: args });
  }
  if (isKnownRequestErrorLike(error)) {
    throw new BadRequestException({
      message: error.message.split("\n\n\n")[1] ?? "Invalid data",
      code: error.code,
      data: error.meta
    });
  }
  if (error instanceof HttpException) {
    throw error;
  }
  errorLogger?.error(error);
  throw new InternalServerErrorException();
}

// src/query-service/errors/is-forbidden-like.ts
function isForbiddenLike(error) {
  return error instanceof Error && (error.name === "ForbiddenError" || error.name === "ForbiddenErrorType");
}

// src/query-service/query.service.ts
var QueryService = class {
  /**
   * Creates a query service.
   *
   * @param table Prisma-compatible delegate.
   * @param serviceOptions Query service options.
   */
  constructor(table, serviceOptions = {}) {
    this.table = table;
    this.serviceOptions = serviceOptions;
  }
  table;
  serviceOptions;
  /**
   * Finds the first item matching query options.
   *
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Found item or null.
   */
  async findOne(options, ability) {
    const args = {
      select: parseQueryObject(options.select),
      include: parseQueryObject(options.include),
      where: this.mergeAbilityWhere(options.where, ability),
      orderBy: parseQueryObject(options.orderBy),
      cursor: parseQueryObject(options.cursor),
      distinct: parseQueryObject(options.distinct)
    };
    try {
      return await this.table.findFirst(args);
    } catch (error) {
      this.handleError(error, options, args);
    }
  }
  /**
   * Finds all items matching query options.
   *
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Found items.
   */
  async findMany(options = {}, ability) {
    const args = {
      select: parseQueryObject(options.select),
      include: parseQueryObject(options.include),
      where: this.mergeAbilityWhere(options.where, ability),
      orderBy: parseQueryObject(options.orderBy),
      cursor: parseQueryObject(options.cursor),
      take: options.take,
      skip: options.skip,
      distinct: parseQueryObject(options.distinct)
    };
    try {
      return await this.table.findMany(args);
    } catch (error) {
      this.handleError(error, options, args);
    }
  }
  /**
   * Finds an item by ID.
   *
   * @param id Item ID.
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Found item.
   * @throws NotFoundException when no item exists.
   */
  async findById(id, options = {}, ability) {
    const args = {
      where: this.mergeAbilityWhere({ id }, ability),
      select: parseQueryObject(options.select),
      include: parseQueryObject(options.include)
    };
    try {
      const item = await this.table.findFirst(args);
      if (!item) {
        throw new NotFoundException("Item not found.");
      }
      return item;
    } catch (error) {
      this.handleError(error, options, args);
    }
  }
  /**
   * Finds an item by a unique where input.
   *
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Found item.
   * @throws NotFoundException when no item exists.
   */
  async findUnique(options, ability) {
    const args = {
      where: parseQueryObject(options.where),
      select: parseQueryObject(options.select),
      include: parseQueryObject(options.include)
    };
    try {
      const item = ability ? await this.table.findFirst({
        ...args,
        where: this.mergeAbilityWhere(options.where, ability)
      }) : await this.table.findUnique(args);
      if (!item) {
        throw new NotFoundException("Item not found.");
      }
      return item;
    } catch (error) {
      this.handleError(error, options, args);
    }
  }
  /**
   * Runs an aggregate query.
   *
   * @param options Aggregate options.
   * @returns Serialized aggregate result.
   */
  async aggregate(options) {
    const args = {
      ...options,
      where: parseQueryObject(options.where),
      orderBy: parseQueryObject(options.orderBy),
      cursor: parseQueryObject(options.cursor)
    };
    const cleanedArgs = Object.fromEntries(
      Object.entries(args).filter(([, value]) => value !== void 0)
    );
    return serializeDecimalValues(await this.table.aggregate(cleanedArgs));
  }
  /**
   * Counts items matching query options.
   *
   * @param options Count options.
   * @param ability Optional access-control ability.
   * @returns Item count.
   */
  async count(options, ability) {
    const args = {
      where: this.mergeAbilityWhere(options.where, ability)
    };
    return await this.table.count(args);
  }
  /**
   * Runs a paginated query.
   *
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Paginated result.
   */
  async query(options, ability) {
    try {
      const page = options.page ?? 1;
      const perPage = options.perPage ?? 10;
      const skip = (page - 1) * perPage;
      const where = this.mergeAbilityWhere(options.where, ability);
      const itemCount = await this.count({ where });
      const items = await this.findMany({ ...options, take: perPage, skip, where });
      const pageMeta = new PageMetaDTO({ itemCount, pageOptions: { page, perPage } });
      return { pageMeta, items };
    } catch (error) {
      if (isForbiddenLike(error)) {
        throw new ForbiddenException("Insufficient permissions.");
      }
      throw error;
    }
  }
  /**
   * Combines a where input with an access-control where input when available.
   *
   * @param where Query where object.
   * @param ability Optional access-control ability.
   * @returns Merged where object.
   */
  mergeAbilityWhere(where, ability) {
    const parsedWhere = parseQueryObject(where ?? {});
    if (!ability || !this.serviceOptions.accessibleWhere || this.serviceOptions.subject === void 0) {
      return parsedWhere;
    }
    return {
      AND: [this.serviceOptions.accessibleWhere(ability, this.serviceOptions.subject), parsedWhere]
    };
  }
  /**
   * Converts Prisma-like errors to Nest HTTP exceptions.
   *
   * @param error Error thrown by a delegate.
   * @param options Original options.
   * @param args Parsed delegate args.
   * @throws Converted Nest HTTP exception.
   */
  handleError(error, options, args) {
    handleQueryServiceError(error, options, args, this.serviceOptions.errorLogger);
  }
};
QueryService = __decorateClass([
  Injectable()
], QueryService);

export {
  parseQueryObject,
  QueryService
};
//# sourceMappingURL=chunk-EY56CNWG.js.map