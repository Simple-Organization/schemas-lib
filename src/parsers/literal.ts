import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { Schema, type SafeParseReturn } from '../schemas/Schema';

//
//

export type Primitive = string | number | bigint | boolean | null | undefined;

//
//

export class LiteralSchema<T extends Primitive> extends Schema<T> {
  constructor(public literal: T) {
    super();

    if (
      typeof literal !== 'string' &&
      typeof literal !== 'number' &&
      typeof literal !== 'bigint' &&
      typeof literal !== 'boolean' &&
      literal !== null &&
      literal !== undefined
    ) {
      throw new Error(
        `The literal value must be a primitive different than symbol. Received: ${literal}`,
      );
    }
  }

  //
  //

  internalParse(originalValue: any): SafeParseReturn<T> {
    let value = originalValue;

    // Boilerplate to normalize the value without trimming
    if (value === '') value = null;
    else if (value === undefined) value = null;

    if (value === null) {
      if (this.req) return safeParseError('required', this, originalValue);
      if (this.def) return safeParseSuccess(this.def());
      return safeParseSuccess();
    }

    if (value !== this.literal) {
      return safeParseError('not_literal_equal', this, originalValue);
    }

    return safeParseSuccess(value);
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

/**
 * Support for literal values different than symbol
 */
export function literal<T extends Primitive>(value: T): LiteralSchema<T> {
  return new LiteralSchema<T>(value);
}
