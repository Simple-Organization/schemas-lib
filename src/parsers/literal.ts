import type { ParseContext } from '../version2/types';
import { Schema2 } from '../version2/Schema2';

//
//

export type Primitive = string | number | bigint | boolean | null | undefined;

//
//

export class LiteralSchema<T extends Primitive> extends Schema2<T> {
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

  process(p: ParseContext): void {
    if (p.value !== this.literal) {
      return p.error('not_literal_equal', this.literal);
    }
  }
}

/**
 * Support for literal values different than symbol
 */
export function literal<T extends Primitive>(value: T): LiteralSchema<T> {
  return new LiteralSchema<T>(value);
}
