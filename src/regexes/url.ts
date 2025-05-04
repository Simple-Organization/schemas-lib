import { Schema, type SafeParseReturn } from '../schemas/Schema';
import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';

//
//

export class URLSchema extends Schema<string> {
  constructor(
    readonly regex?: RegExp,
    readonly msg?: string,
  ) {
    super();
  }

  //
  //

  internalParse(originalValue: any): SafeParseReturn<string> {
    let value = originalValue;

    // Boilerplate to normalize the value without trimming
    if (value === '') value = null;
    else if (value === undefined) value = null;

    if (value === null) {
      if (this.req) return safeParseError('required', this, originalValue);
      if (this.def) return safeParseSuccess(this.def());
      return safeParseSuccess();
    }

    try {
      if (typeof value !== 'string') {
        return safeParseError('not_url', this, originalValue);
      }

      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        value = 'http://' + value;
      }

      new URL(value);
    } catch (_) {
      return safeParseError('not_url', this, originalValue);
    }

    return safeParseSuccess(value);
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

/**
 * Checks if the value is a valid URL
 */
export function url() {
  return new URLSchema();
}
