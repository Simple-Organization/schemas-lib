import type { SchemaMeta } from '../types';
import { Issue } from '../Issue';
import { NumberSchema } from '../schemas/NumberSchema';
import { setDefaultMeta } from '../utils/utils';

export function numberParser(
  value: any,
  meta: SchemaMeta,
  originalValue: any,
): Issue | number {
  if (typeof value === 'string') {
    value = +value;
  }

  if (typeof value !== 'number') {
    return new Issue('not_number_type', meta, originalValue);
  }

  if (Number.isNaN(value)) {
    return new Issue('nan', meta, originalValue);
  }

  return value;
}

/**
 * Any number accepting Infinity too, but does not accept NaN
 */
export const number = new NumberSchema([numberParser]);

if (__DEV__) {
  setDefaultMeta(number, 'number', 'REAL');
}
