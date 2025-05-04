import { NumberSchema } from '../schemas/NumberSchema';
import { SafeParseReturn } from '../schemas/NewSchema';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';

class IntSchema extends NumberSchema {
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
      return safeParseError('not_number_type', this, value);
    }

    if (!Number.isInteger(value)) {
      return safeParseError('not_integer', this, originalValue);
    }

    return safeParseSuccess(value);
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
