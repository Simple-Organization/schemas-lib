import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { NewSchema, type SafeParseReturn } from '../schemas/NewSchema';

//
//

export class EnumSchema extends NewSchema<string> {
  enum: string[] = [];

  //
  //

  internalParse(originalValue: any): SafeParseReturn<string> {
    let value = originalValue;

    if (typeof value === 'string') {
      value = value.trim();
      if (value === '') {
        value = null;
      }
    } else if (value === undefined) {
      value = null;
    }

    if (value === null) {
      if (this.req) {
        return safeParseError('required', this, originalValue);
      }
      if (this.def) {
        return safeParseSuccess(this.def());
      }
      return safeParseSuccess();
    }

    if (typeof value !== 'string') {
      return safeParseError('not_string_type', this, originalValue);
    }

    if (!this.enum.includes(value)) {
      return safeParseError('not_enum', this, originalValue);
    }

    return safeParseSuccess(value);
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

//
//

export function enumType<
  E extends string | number,
  T extends Readonly<[...E[]]>,
>(values: T): NewSchema<T[number]> {
  const schema = new EnumSchema();

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

  return schema as any as NewSchema<T[number]>;
}
