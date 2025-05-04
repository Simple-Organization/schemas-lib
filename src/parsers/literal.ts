import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { NewSchema, SafeParseReturn } from '../schemas/NewSchema';

//
//

export type Primitive = string | number | bigint | boolean | null | undefined;

//
//

export class LiteralSchema<T extends Primitive> extends NewSchema<T> {
  constructor(public literal: T) {
    super();
  }

  //
  //

  clone(): this {
    const clone = super.clone() as this;
    clone.literal = this.literal;
    return clone;
  }

  //
  //

  _safeParse(originalValue: any): SafeParseReturn<T> {
    let value = originalValue;

    if (typeof value === 'string') {
      value = value.trim();
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

    if (value !== this.literal) {
      return safeParseError('not_literal_equal', this, originalValue);
    }

    return safeParseSuccess(value);
  }
}

/**
 * Support for literal values different than symbol
 */
export function literal<T extends Primitive>(value: T): LiteralSchema<T> {
  const schema = new LiteralSchema<T>(value);

  //
  //  Dev generation values

  if (
    typeof value !== 'string' &&
    typeof value !== 'number' &&
    typeof value !== 'bigint' &&
    typeof value !== 'boolean' &&
    value !== null &&
    value !== undefined
  ) {
    throw new Error(
      `The literal value must be a primitive different than symbol. Received: ${value}`,
    );
  }

  return schema;
}
