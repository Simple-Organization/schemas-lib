import { Schema, type SafeParseReturn } from '../schemas/Schema';
import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { hostname_regex } from './zodRegexes';

//
//

export class URLSchema extends Schema<string> {
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

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

/**
 * Checks if the value is a valid URL
 */
export function url() {
  return new URLSchema();
}
