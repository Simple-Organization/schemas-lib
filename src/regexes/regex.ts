import { Schema, type SafeParseReturn } from '../schemas/Schema';
import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';

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

    if (!this.regex.test(value)) {
      return safeParseError(this.msg || 'not_regex', this, originalValue);
    }

    return safeParseSuccess(value);
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

/**
 * A string with a regex
 */
export function regex(regex: RegExp, msg?: string) {
  return new RegexSchema(regex, msg);
}
