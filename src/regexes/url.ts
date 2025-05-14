import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { Schema } from '../version2/Schema';
import type { ParseContext, SafeParseReturn } from '../version2/types';
import { hostname_regex } from './zodRegexes';

//
//

export class URLSchema extends Schema<string> {
  process(c: ParseContext): void {
    throw new Error('Method not implemented.');
  }
  internalParse(originalValue: any): SafeParseReturn<string> {
    let value = originalValue;

    // Boilerplate to normalize the value without trimming
    if (value === '') value = null;
    else if (value === undefined) value = null;

    if (value === null) {
      if (this.req) return safeParseError('required', this, originalValue);
      if (this.def) return safeParseSuccess(this.def());
      return safeParseSuccess();
    }

    if (typeof value !== 'string')
      return safeParseError('not_string', this, originalValue);

    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      value = 'http://' + value;
    }

    try {
      const url = new URL(value);
      hostname_regex.lastIndex = 0;
      if (!hostname_regex.test(url.hostname))
        return safeParseError('not_url', this, originalValue);
    } catch (_) {
      return safeParseError('not_url', this, originalValue);
    }

    return safeParseSuccess(value);
  }
}

/**
 * Checks if the value is a valid URL
 */
export function url() {
  return new URLSchema();
}
