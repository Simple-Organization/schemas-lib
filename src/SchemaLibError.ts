import {
  type ISchema,
  NewSchema,
  type SafeParseReturn,
} from './schemas/NewSchema';
import { validationErrors } from './validationErrors';

export class SchemaLibError {
  readonly value: any;

  constructor(
    readonly code: string,
    readonly owner: ISchema<any>,
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
    const error = validationErrors[this.code];

    if (typeof error === 'function') {
      return error(this.value, this.owner);
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
  return {
    success: false,
    error: new SchemaLibError(code, owner, originalValue),
  };
}

//
//

export function safeParseSuccess<T>(
  data: T | null | undefined = null,
): SafeParseReturn<T> {
  return { success: true, data: data as any };
}
