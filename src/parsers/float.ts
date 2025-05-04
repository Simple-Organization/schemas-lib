import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { MinMaxSchema } from '../schemas/MinMaxSchema';
import { SafeParseReturn } from '../schemas/NewSchema';

//
//

export class NumberSchema extends MinMaxSchema<number> {
  //
  //

  _safeParse(originalValue: any): SafeParseReturn<number> {
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
      if (this._required) {
        return safeParseError('required', this, originalValue);
      }

      if (this._default) {
        return safeParseSuccess(this._default());
      }

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
}

export function float(): NumberSchema {
  return new NumberSchema();
}

export function number(): NumberSchema {
  return new NumberSchema();
}
