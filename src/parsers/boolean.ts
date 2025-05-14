import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';

//
//

export const trueOptions = [true, 1, 'true', '1', 'on'] as const;
export const falseOptions = [false, 0, 'false', '0', 'off'] as const;

//
//

export class BooleanSchema extends Schema<boolean> {
  //
  //

  process(p: ParseContext): void {
    if (trueOptions.includes(p.value)) {
      p.value = true;
    } else if (falseOptions.includes(p.value)) {
      p.value = false;
    } else {
      return p.error('boolean_type');
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
export function boolean(): BooleanSchema {
  return new BooleanSchema();
}
