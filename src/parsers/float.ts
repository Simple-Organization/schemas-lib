import type { SchemaMeta } from '../types';
import { Issue } from '../Issue';
import { NumberSchema } from '../schemas/NumberSchema';
import { numberParser } from './number';

export function notInfinityParser(
  value: any,
  meta: SchemaMeta,
  originalValue: any,
): Issue | number {
  if (!Number.isFinite(value)) {
    return new Issue('not_finite', meta, originalValue);
  }

  return value;
}

/**
 * Any number, but does not accept Infinity and NaN
 */

export const float = new NumberSchema([numberParser, notInfinityParser]);
