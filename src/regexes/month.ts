import { Schema, type SafeParseReturn } from '../schemas/Schema';
import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';

//
//

export class MonthSchema extends Schema<string> {
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

    if (typeof value !== 'string')
      return safeParseError('not_string', this, originalValue);

    if (!/^\d{4}-\d{2}$/.test(value)) {
      return safeParseError('not_month', this, originalValue);
    }

    const date = new Date(value);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 7) !== value
    ) {
      return safeParseError('not_month', this, originalValue);
    }

    return safeParseSuccess(value);
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

/**
 * Month
 */
export function month() {
  return new MonthSchema();
}
