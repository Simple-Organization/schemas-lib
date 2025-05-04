import { Schema, type SafeParseReturn } from '../schemas/Schema';
import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { email_regex, ipv4_regex } from './zodRegexes';

//
//

export class RegexSchema extends Schema<string> {
  constructor(
    readonly regex: RegExp,
    readonly msg?: string,
  ) {
    super();
  }

  //
  //

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
      return safeParseError('not_string_type', this, originalValue);

    this.regex.lastIndex = 0; // Reset the regex index to 0
    if (!this.regex.test(value)) {
      return safeParseError(this.msg || 'not_regex', this, originalValue);
    }

    return safeParseSuccess(value);
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

/** A string with a regex */
export function regex(regex: RegExp, msg?: string) {
  return new RegexSchema(regex, msg);
}

/** ipv4 */
export function ipv4() {
  return new RegexSchema(ipv4_regex, 'O campo não é um ipv4');
}

/** email */
export function email() {
  return new RegexSchema(email_regex, 'O campo não é um email');
}
