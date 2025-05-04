import type { ValidationErrorRecord } from '../validationErrors';
import { Schema, type ISchema, type SafeParseReturn } from '../schemas/Schema';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';

//
//

export class ArraySchema<S extends ISchema<any>>
  implements ISchema<Array<S extends ISchema<infer E> ? E : never>>
{
  element: S;
  /** Property used only for type inference */
  declare readonly _o: Array<S extends ISchema<infer E> ? E : never>;
  declare readonly isSchema: true;

  req = true;

  def?: () => Array<S extends ISchema<infer E> ? E : never>;

  //
  //

  constructor(readonly elementSchema: S) {
    this.element = elementSchema;
  }

  internalParse(
    originalValue: any,
  ): SafeParseReturn<Array<S extends ISchema<infer E> ? E : never>> {
    let value = originalValue;

    //
    //  If the value is a string, try to parse it as JSON

    if (typeof value === 'string') {
      if (value === '') {
        value = null;
      } else {
        try {
          value = JSON.parse(value);
        } catch {
          return safeParseError('not_valid_json', this, originalValue);
        }
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

    //
    //  If the value is not an array, return an error

    if (!Array.isArray(value)) {
      return safeParseError('not_array', this, originalValue);
    }

    //
    //  Validates each element of the array

    const results: SafeParseReturn<any>[] = [];
    const output: any[] = [];

    for (const item of value) {
      const result = this.element.safeParse(item);

      if (!result.success) {
        return safeParseError('invalid_array_element', this, originalValue);
      }

      output.push(result.data);
      results.push(result);
    }

    return safeParseSuccess(
      output as Array<S extends ISchema<infer E> ? E : never>,
    );
  }

  //
  //  Schema info about optional, required, default
  //

  declare optional: () => ISchema<
    | Exclude<Array<S extends ISchema<infer E> ? E : never>, null>
    | null
    | undefined
  >;
  /** Set to default value when the value is null or undefined */
  declare default: (
    defaultSetter:
      | (() => Array<S extends ISchema<infer E> ? E : never>)
      | Array<S extends ISchema<infer E> ? E : never>,
  ) => ArraySchema<S>;
  /**
   * Parse the value, throw {@link SafeParseReturn} when the value is invalid
   */
  declare parse: (
    originalValue: any,
  ) => Array<S extends ISchema<infer E> ? E : never>;
  /**
   * Parse the value, return {@link SafeParseReturn} when the value is invalid
   */
  declare safeParse: (
    originalValue: any,
  ) => SafeParseReturn<Array<S extends ISchema<infer E> ? E : never>>;

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

//
//

ArraySchema.prototype.optional = Schema.prototype.optional as any;
ArraySchema.prototype.default = Schema.prototype.default as any;
ArraySchema.prototype.safeParse = Schema.prototype.safeParse as any;
ArraySchema.prototype.parse = Schema.prototype.parse as any;
(ArraySchema.prototype as any).isSchema = true;

//
//

export function array<T extends ISchema<any>>(
  elementSchema: T,
): ArraySchema<T> {
  return new ArraySchema(elementSchema);
}
