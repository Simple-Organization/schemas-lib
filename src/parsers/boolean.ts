import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { Schema, type SafeParseReturn } from '../schemas/Schema';

//
//

export const trueOptions = [true, 1, 'true', '1', 'on'] as const;
export const falseOptions = [false, 0, 'false', '0', 'off'] as const;

//
//

export class BooleanSchema extends Schema<boolean> {
  //
  //

  internalParse(originalValue: any): SafeParseReturn<boolean> {
    let value = originalValue;

    // Boilerplate to normalize the value without trimming
    if (value === '') value = null;
    else if (value === undefined) value = null;

    if (value === null) {
      if (this.req) return safeParseError('required', this, originalValue);
      if (this.def) return safeParseSuccess(this.def());
      return safeParseSuccess();
    }

    if (trueOptions.includes(value)) {
      return safeParseSuccess(true);
    } else if (falseOptions.includes(value)) {
      return safeParseSuccess(false);
    } else {
      return safeParseError('boolean_type', this, originalValue);
    }
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

/**
 * Boolean value, can be:
 *
 * ```ts
 *  true = [true,  1, 'true',  '1', 'on']
 * false = [false, 0, 'false', '0', 'off']
 * ```
 *
 * `on` and `off` are for `HTMLInput[type='checkbox']`
 */
export function boolean() {
  return new BooleanSchema();
}
