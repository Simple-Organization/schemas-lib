import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { MinMaxSchema } from '../schemas/MinMaxSchema';
import type { SafeParseReturn } from '../schemas/Schema';

//
//

export class NumberSchema extends MinMaxSchema<number> {
  //
  //

  internalParse(originalValue: any): SafeParseReturn<number> {
    let value = originalValue;

    if (typeof value === 'string') {
      value = value.trim();
      if (value === '') value = null;
      else value = Number(value);
    } else if (value === undefined) value = null;

    if (value === null) {
      if (this.req) return safeParseError('required', this, originalValue);
      if (this.def) return safeParseSuccess(this.def());
      return safeParseSuccess();
    }

    if (typeof value !== 'number') {
      return safeParseError('not_number_type', this, originalValue);
    }

    if (Number.isNaN(value)) {
      return safeParseError('nan', this, originalValue);
    }

    if (!Number.isFinite(value)) {
      return safeParseError('not_finite', this, originalValue);
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

export function float(): NumberSchema {
  return new NumberSchema();
}

export function number(): NumberSchema {
  return new NumberSchema();
}
