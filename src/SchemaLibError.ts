import { NewSchema, SafeParseReturn } from './schemas/NewSchema';
import { validationErrors } from './validationErrors';

export class SchemaLibError {
  readonly value: any;

  constructor(
    readonly code: string,
    readonly owner: NewSchema<any>,
    originalValue: any,
  ) {
    this.value = originalValue;

    if (code !== 'custom' && validationErrors[code] === undefined) {
      throw new Error(`Validation error "${code}" not found`);
    }
  }

  get message() {
    return this.toString();
  }

  /**
   * Serialize the Issue, in object and array will return a object with the errors
   */
  serialize(): string | Record<string, any> {
    return this.toString();
  }

  toString() {
    if (this.meta.errors && this.meta.errors[this.code]) {
      const error = this.meta.errors[this.code];

      if (typeof error === 'function') {
        return error(this.value, this.meta);
      }

      return error;
    }

    const error = validationErrors[this.code];

    if (typeof error === 'function') {
      return error(this.value, this.meta);
    }

    return error;
  }
}

//
//

export function safeParseError<T>(
  code: string,
  owner: NewSchema<T>,
  originalValue: any,
): SafeParseReturn<T> {
  return { success: false, error: new SchemaLibError(code, owner, originalValue) }
}

//
//

export function safeParseSuccess<T>(
  data?: T
): SafeParseReturn<T> {
  return { success: true, data }
}

//
//

/**
 * Issue used by ObjectSchema and ArraySchema
 */
export class ObjectIssue extends SchemaLibError {
  readonly errors: Record<string, SchemaLibError> = {};

  serialize() {
    const errors: Record<string, any> = {};

    for (const key of Object.keys(this.errors)) {
      errors[key] = this.errors[key].serialize();
    }

    return errors;
  }

  toString() {
    return JSON.stringify(this.serialize());
  }
}
