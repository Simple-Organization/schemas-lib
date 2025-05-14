import type { ParseContext, SafeParseReturn } from '../version2/types';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { Schema } from '../version2/Schema';

//
//

export class MonthSchema extends Schema<string> {
  process(c: ParseContext): void {
    throw new Error('Method not implemented.');
  }
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
}

/**
 * Month
 */
export function month() {
  return new MonthSchema();
}
