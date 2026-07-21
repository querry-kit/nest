import { PipeTransform, ArgumentMetadata } from '@nestjs/common';

/**
 * Pipe for normalizing blank strings in request bodies to null.
 */
declare class EmptyStringToNullPipe implements PipeTransform {
    /**
     * Transforms request body values by replacing blank string entries with null.
     * @param {unknown} value The incoming request value.
     * @param {ArgumentMetadata} metadata Metadata of the current argument.
     * @returns {unknown} The transformed body value or the unchanged value.
     */
    transform(value: unknown, metadata: ArgumentMetadata): unknown;
    /**
     * Recursively maps empty strings in any nested structure to null.
     * @param {unknown} value The value to normalize.
     * @returns {unknown} The normalized value.
     */
    private static mapEmptyStringToNull;
}

/**
 * Pipe for parsing and normalizing query parameters.
 */
declare class QueryTransformPipe implements PipeTransform {
    /**
     * Transforms query values by parsing primitive string values and dotted keys.
     *
     * @param {unknown} value Incoming request value.
     * @param {ArgumentMetadata} metadata Nest argument metadata.
     * @returns {unknown} Transformed query object or unchanged value.
     */
    transform(value: unknown, metadata: ArgumentMetadata): unknown;
}

export { EmptyStringToNullPipe, QueryTransformPipe };
