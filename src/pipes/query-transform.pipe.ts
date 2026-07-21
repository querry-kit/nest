import { Injectable, type ArgumentMetadata, type PipeTransform } from '@nestjs/common';
import { parseObject } from '../util/object/index';

/**
 * Pipe for parsing and normalizing query parameters.
 */
export class QueryTransformPipe implements PipeTransform {
  /**
   * Transforms query values by parsing primitive string values and dotted keys.
   *
   * @param {unknown} value Incoming request value.
   * @param {ArgumentMetadata} metadata Nest argument metadata.
   * @returns {unknown} Transformed query object or unchanged value.
   */
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type === 'query' && typeof value === 'object') {
      return parseObject(value);
    }

    return value;
  }
}

Injectable()(QueryTransformPipe);
