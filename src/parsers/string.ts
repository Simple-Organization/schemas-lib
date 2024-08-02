import { StringSchema } from '../schemas/StringSchema';
import { Issue } from '../Issue';
import { setDefaultMeta } from '../utils/utils';
import { SchemaMeta } from '../types';

export function stringParser(
  value: any,
  meta: SchemaMeta,
  originalValue: any,
): Issue | string {
  if (typeof value !== 'string') {
    return new Issue('not_string_type', meta, originalValue);
  }

  return value;
}

/**
 * A string with any length
 */
export const string = new StringSchema([stringParser]);

if (__DEV__) {
  setDefaultMeta(string, 'string', 'TEXT');
}

//
//

export function trimParser(value: any): Issue | string {
  return typeof value === 'string' ? value.trim() : value;
}

/**
 * A string, but always trim in the start of the parse
 */
export const trimmed = new StringSchema([trimParser, stringParser]);

if (__DEV__) {
  setDefaultMeta(trimmed, 'string', 'TEXT');
}
