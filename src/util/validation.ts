import { getMetadataStorage, type ValidationError } from 'class-validator';
import type { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';

/**
 * Description of a failed class-validator constraint.
 */
export type ValidationErrorDescription = {
  /** Name of the failed validator. */
  name: string;
  /** Static constraint values configured for the validator. */
  constraints: string[];
};

/**
 * Nested validation error map keyed by property name.
 */
export type ValidationPropertyErrors = {
  [property: string]: ValidationErrorDescription[] | ValidationPropertyErrors;
};

/**
 * Utility class for validation-related operations.
 */
export class ValidationUtil {
  /**
   * Returns validation metadata for a specific validation error target.
   *
   * @param {ValidationError} error The validation error to inspect.
   * @returns {ValidationMetadata[]} The metadata entries for the error target.
   */
  private static getMetaData(error: ValidationError): ValidationMetadata[] {
    if (!error.target) {
      return [];
    }

    return getMetadataStorage().getTargetValidationMetadatas(
      error.target.constructor,
      error.target.constructor.name,
      true,
      false,
    );
  }

  /**
   * Processes constraints for a specific validation error.
   *
   * @param {ValidationError} error The error to process.
   * @param {ValidationMetadata[]} metaData The metadata entries for the error target.
   * @returns {ValidationErrorDescription[]} The normalized constraint descriptions.
   */
  private static processConstraints(
    error: ValidationError,
    metaData: ValidationMetadata[],
  ): ValidationErrorDescription[] {
    const result: ValidationErrorDescription[] = [];

    for (const [key, message] of Object.entries(error.constraints ?? {})) {
      const meta = metaData.find((x) => x.propertyName === error.property && x.name === key);
      if (meta) {
        result.push({
          name: meta.name ?? key,
          constraints: (meta.constraints ?? []).filter(Boolean).map(String),
        });
      } else {
        result.push({ name: key, constraints: [message] });
      }
    }

    return result;
  }

  /**
   * Recursively processes child validation errors into a nested error map.
   *
   * @param {ValidationError[]} children The child errors to process.
   * @param {ValidationMetadata[]} metaData The metadata entries for the error target.
   * @returns {ValidationPropertyErrors} The nested error structure.
   */
  private static processChildren(
    children: ValidationError[],
    metaData: ValidationMetadata[],
  ): ValidationPropertyErrors {
    const nestedErrors: ValidationPropertyErrors = {};

    for (const child of children) {
      if (child.constraints) {
        nestedErrors[child.property] = this.processConstraints(child, metaData);
      }
      if (child.children && child.children.length > 0) {
        nestedErrors[child.property] = this.processChildren(child.children, metaData);
      }
    }

    return nestedErrors;
  }

  /**
   * Maps class-validator errors into a structured object representation.
   *
   * @param {ValidationError[]} errors The validation errors to map.
   * @returns {ValidationPropertyErrors} The mapped validation errors.
   */
  public static mapValidationErrorsToObject(errors: ValidationError[]): ValidationPropertyErrors {
    const result: ValidationPropertyErrors = {};

    for (const error of errors) {
      const metaData = this.getMetaData(error);

      if (error.constraints) {
        result[error.property] = this.processConstraints(error, metaData);
      }
      if (error.children && error.children.length > 0) {
        result[error.property] = this.processChildren(error.children, metaData);
      }
    }

    return result;
  }
}
