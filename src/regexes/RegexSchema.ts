import type { ParseContext, SafeParseReturn } from '../version2/types';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { Schema } from '../version2/Schema';

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

  process(p: ParseContext): void {
    if (typeof p.value !== 'string') return p.error('not_string_type');

    this.regex.lastIndex = 0; // Reset the regex index to 0
    if (!this.regex.test(p.value)) {
      // TODO: add a better error message
      return p.error('not_regex');
    }
  }
}
