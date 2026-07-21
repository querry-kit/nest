import { FieldsProjection } from '../types/schema.types';

/**
 * Applies validated `fields` projections to objects and arrays.
 */
export class FieldsProjector {
  /**
   * Projects any source value to the requested shape.
   *
   * @param {T} value The source value to project.
   * @param {FieldsProjection} [projection] The requested fields tree.
   * @returns {T} The projected value.
   */
  static project<T = unknown>(value: T, projection?: FieldsProjection): T {
    if (!projection) {
      return value;
    }

    return this.projectInternal(value, projection) as T;
  }

  /**
   * Recursively projects one value.
   *
   * @param {unknown} value The current source value.
   * @param {FieldsProjection | true} projection The projection node.
   * @returns {unknown} The projected value for the current node.
   */
  private static projectInternal(value: unknown, projection: FieldsProjection | true): unknown {
    if (projection === true) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.projectInternal(item, projection));
    }

    if (value === null || typeof value === 'undefined') {
      return value;
    }

    if (typeof value !== 'object') {
      return value;
    }

    const source = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(projection)) {
      out[key] = this.projectInternal(source[key], projection[key]);
    }

    return out;
  }
}
