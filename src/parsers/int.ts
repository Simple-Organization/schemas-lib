import type { SafeParseReturn } from '../schemas/NewSchema';
import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { MinMaxSchema } from '../schemas/MinMaxSchema';

class IntSchema extends MinMaxSchema<number> {
  internalParse(originalValue: any): SafeParseReturn<number> {
    let value = originalValue;

    if (typeof value === 'string') {
      value = value.trim();
      if (value === '') {
        value = undefined;
      } else {
        value = Number(value);
      }
    } else if (value === null) {
      value = undefined;
    }

    if (value === undefined) {
      if (this.req) {
        return safeParseError('required', this, originalValue);
      }

      if (this.def) {
        return safeParseSuccess(this.def());
      }

      return safeParseSuccess();
    }

    if (typeof value !== 'number') {
      return safeParseError('not_number_type', this, value);
    }

    if (!Number.isInteger(value)) {
      return safeParseError('not_integer', this, originalValue);
    }

    if (this.vMin !== undefined && value < this.vMin) {
      return safeParseError('min_number', this, originalValue);
    }

    if (this.vMax !== undefined && value > this.vMax) {
      return safeParseError('max_number', this, originalValue);
    }

    return safeParseSuccess(value);
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

//
//

/**
 * Only integer numbers, can be bigger than 32 bits integers
 */
export function int() {
  return new IntSchema();
}
