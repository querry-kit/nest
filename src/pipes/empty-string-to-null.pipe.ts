import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Pipe for normalizing blank strings in request bodies to null.
 */
@Injectable()
export class EmptyStringToNullPipe implements PipeTransform {
  /**
   * Transforms request body values by replacing blank string entries with null.
   * @param {unknown} value The incoming request value.
   * @param {ArgumentMetadata} metadata Metadata of the current argument.
   * @returns {unknown} The transformed body value or the unchanged value.
   */
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type !== 'body') {
      return value;
    }

    return EmptyStringToNullPipe.mapEmptyStringToNull(value);
  }

  /**
   * Recursively maps empty strings in any nested structure to null.
   * @param {unknown} value The value to normalize.
   * @returns {unknown} The normalized value.
   */
  private static mapEmptyStringToNull(value: unknown): unknown {
    if (typeof value === 'string') {
      const trimmed = value.trim();

      return trimmed === '' ? null : trimmed;
    }

    if (Array.isArray(value)) {
      return value.map((item) => EmptyStringToNullPipe.mapEmptyStringToNull(item));
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, item]) => [
          key,
          EmptyStringToNullPipe.mapEmptyStringToNull(item),
        ]),
      );
    }

    return value;
  }
}
