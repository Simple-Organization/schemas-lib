import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';

//
//

export class EnumSchema extends Schema<string> {
  enum: string[] = [];

  //
  //

  process(p: ParseContext): void {
    if (typeof p.value !== 'string') {
      return p.error('not_string_type');
    }

    if (!this.enum.includes(p.value)) {
      return p.error('not_enum', this.enum);
    }
  }
}

//
//

export function enumType<
  E extends string | number,
  T extends Readonly<[...E[]]>,
>(values: T): Schema<T[number]> {
  const schema = new EnumSchema();
  schema.enum = values as any as string[];

  //
  //  Dev generation values

  const array = values as any as string[];

  if (array.length < 2) {
    throw new Error(
      `You must provide at least 2 values for the enumType. Received: ${array.length}`,
    );
  }

  if (array.some((v) => typeof v !== 'string' && typeof v !== 'number')) {
    throw new Error(
      `All values of the enumType must be strings or numbers. Received: ${array}`,
    );
  }

  return schema as any as Schema<T[number]>;
}
