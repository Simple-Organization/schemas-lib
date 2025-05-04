import type { SafeParseReturn } from '../schemas/Schema';
import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { MinMaxSchema } from '../schemas/MinMaxSchema';

//
//

export class StringSchema extends MinMaxSchema<string> {
  trim = true;

  //
  //

  internalParse(originalValue: any): SafeParseReturn<string> {
    let value = originalValue;

    // Boilerplate to normalize the value with trimming
    if (typeof value === 'string') {
      if (this.trim) value = value.trim();
      if (value === '') value = null;
    } else if (value === undefined) value = null;

    if (value === null) {
      if (this.req) return safeParseError('required', this, originalValue);
      if (this.def) return safeParseSuccess(this.def());
      return safeParseSuccess();
    }

    if (typeof value !== 'string') {
      return safeParseError('not_string_type', this, originalValue);
    }

    if (this.vMin !== undefined && value.length < this.vMin) {
      return safeParseError('min_number', this, originalValue);
    }

    if (this.vMax !== undefined && value.length > this.vMax) {
      return safeParseError('max_number', this, originalValue);
    }

    return safeParseSuccess(value);
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

/**
 * A string with any length
 */
export function string() {
  const schema = new StringSchema();
  schema.trim = false;
  return schema;
}

/**
 * A string, but always trim in the start of the parse
 */
export function trimmed() {
  return new StringSchema();
}
