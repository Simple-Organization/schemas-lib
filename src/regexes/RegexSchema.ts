import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';
import { trimPreprocess } from '../preprocess/trimPreprocess';

//
//

export class RegexSchema extends Schema<string> {
  constructor(
    readonly regex: RegExp,
    readonly msg: string,
  ) {
    super();
  }

  //
  //

  process(p: ParseContext): void {
    if (typeof p.value !== 'string') return p.error('not_string_type');

    this.regex.lastIndex = 0; // Reset the regex index to 0

    if (!this.regex.test(p.value)) {
      return p.error('not_regex', this.msg);
    }
  }
}

//
//

export class TrimRegexSchema extends Schema<string> {
  constructor(
    readonly regex: RegExp,
    readonly msg: string,
  ) {
    super();
  }

  //
  //

  declare process: (p: ParseContext) => void;
}

TrimRegexSchema.prototype.process = RegexSchema.prototype.process;
TrimRegexSchema.prototype.preprocess = trimPreprocess;
