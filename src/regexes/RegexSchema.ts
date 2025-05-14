import type { ParseContext, SafeParseReturn } from '../version2/types';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { Schema } from '../version2/Schema';

//
//

export class RegexSchema extends Schema<string> {
  process(c: ParseContext): void {
    throw new Error('Method not implemented.');
  }
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
      // TODO: add a better error message
      return safeParseError('not_regex', this, originalValue);
    }

    return safeParseSuccess(value);
  }
}
