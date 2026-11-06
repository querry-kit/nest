import { Injectable, type ArgumentMetadata, type PipeTransform } from '@nestjs/common';
import { parseObject } from '../util/object/index';

/**
 * Pipe for parsing and normalizing query parameters.
 */
export class QueryTransformPipe implements PipeTransform {
  /**
   * Configures opt-in preservation of JSON-encoded where filters.
   *
   * @param {{ preserveJsonWhereTypes?: boolean }} options Keep where JSON intact for typed query services.
   */
  constructor(private readonly options: { preserveJsonWhereTypes?: boolean } = {}) {}

  /**
   * Transforms query values by parsing primitive string values and dotted keys.
   *
   * @param {unknown} value Incoming request value.
   * @param {ArgumentMetadata} metadata Nest argument metadata.
   * @returns {unknown} Transformed query object or unchanged value.
   */
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type === 'query' && typeof value === 'object') {
      if (
        this.options.preserveJsonWhereTypes &&
        value !== null &&
        'where' in value &&
        typeof value.where === 'string'
      ) {
        const { where, ...rest } = value;
        return { ...parseObject(rest), where };
      }
      return parseObject(value);
    }

    return value;
  }
}

Injectable()(QueryTransformPipe);
