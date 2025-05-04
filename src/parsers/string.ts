import { NewSchema, SafeParseReturn } from '../schemas/NewSchema';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';

//
//

export class StringSchema extends NewSchema<string> {
  trim = true;

  //
  //

  clone(): this {
    const clone = super.clone() as this;
    clone.trim = this.trim;
    return clone;
  }

  //
  //

  _safeParse(originalValue: any): SafeParseReturn<string> {
    let value = originalValue;

    if (typeof value === 'string') {
      if (this.trim) {
        value = value.trim();
      }

      if (value === '') {
        value = undefined;
      }
    } else if (value === null) {
      value = undefined;
    }

    if (value === undefined) {
      if (this._required) {
        return safeParseError('required', this, originalValue);
      }

      if (this._default) {
        return safeParseSuccess(this._default());
      }

      return safeParseSuccess();
    }

    if (typeof value !== 'string') {
      return safeParseError('not_string_type', this, originalValue);
    }

    if (this.vMin && value.length < this.vMin) {
      return safeParseError('min_number', this, originalValue);
    }

    if (this.vMax && value.length > this.vMax) {
      return safeParseError('max_number', this, originalValue);
    }

    return safeParseSuccess(value);
  }
}

/**
 * A string with any length
 */
export function string() {
  const schema = new StringSchema();
  schema.trim = false;
  return schema;
}

/**
 * A string, but always trim in the start of the parse
 */
export function trimmed() {
  return new StringSchema();
}
