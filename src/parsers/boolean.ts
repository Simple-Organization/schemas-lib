import { Issue } from '../Issue';
import { Schema } from '../schemas/Schema';
import { SchemaMeta, falseOptions, trueOptions } from '../types';
import { setDefaultMeta } from '../utils/utils';

export function booleanParser(
  value: any,
  meta: SchemaMeta,
  originalValue: any,
): Issue | boolean {
  if (trueOptions.includes(value)) {
    return true;
  } else if (falseOptions.includes(value)) {
    return false;
  } else {
    return new Issue('boolean_type', meta, originalValue);
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
export const boolean = new Schema<boolean>([booleanParser]);

if (!__SERVER__) boolean.meta.inputType = 'checkbox';

if (__DEV__) {
  setDefaultMeta(boolean, 'boolean', 'INTEGER');
}
