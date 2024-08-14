import type { SchemaMeta } from '../types';
import { Issue } from '../Issue';
import { NumberSchema } from '../schemas/NumberSchema';

export function intParser(
  value: any,
  meta: SchemaMeta,
  originalValue: any,
): Issue | number {
  if (typeof value === 'string') {
    if (value === '') {
      value = null;
    } else if (!/^\s*\d+\s*$/.test(value)) {
      return new Issue('not_number_string', meta, originalValue);
    } else {
      value = +value;
    }
  } else {
    if (typeof value !== 'number') {
      return new Issue('not_number_type', meta, originalValue);
    }

    if (!Number.isInteger(value)) {
      return new Issue('not_integer', meta, originalValue);
    }
  }

  return value;
}

/**
 * Only integer numbers, can be bigger than 32 bits integers
 */
export const int = new NumberSchema([intParser], { jsType: 'number' });
