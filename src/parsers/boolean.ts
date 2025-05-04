import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { NewSchema, type SafeParseReturn } from '../schemas/NewSchema';

//
//

export const trueOptions = [true, 1, 'true', '1', 'on'] as const;
export const falseOptions = [false, 0, 'false', '0', 'off'] as const;

//
//

export class BooleanSchema extends NewSchema<boolean> {
  //
  //

  _safeParse(originalValue: any): SafeParseReturn<boolean> {
    let value = originalValue;

    if (typeof value === 'string') {
      value = value.trim();
      if (value === '') {
        value = undefined;
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

    if (trueOptions.includes(value)) {
      return safeParseSuccess(true);
    } else if (falseOptions.includes(value)) {
      return safeParseSuccess(false);
    } else {
      return safeParseError('boolean_type', this, originalValue);
    }
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
