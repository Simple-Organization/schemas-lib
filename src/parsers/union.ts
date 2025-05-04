import type { ValidationErrorRecord } from '../validationErrors';
import {
  NewSchema,
  type ISchema,
  type SafeParseReturn,
} from '../schemas/NewSchema';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';

//
//

export class UnionSchema<S extends ISchema<any>[]>
  implements ISchema<S[number] extends ISchema<infer E> ? E : never>
{
  schemas: S;
  /** Property used only for type inference */
  declare readonly _o: S[number] extends ISchema<infer E> ? E : never;
  declare readonly isSchema: true;

  req = true;

  def?: () => S[number] extends ISchema<infer E> ? E : never;

  //
  //

  constructor(schemas: S) {
    if (!Array.isArray(schemas) || schemas.length < 2) {
      throw new Error(
        `You must provide at least 2 schemas for the union. Received: ${schemas.length}`,
      );
    }
    if (schemas.some((v) => typeof v !== 'object' || !(v as any).isSchema)) {
      throw new Error(
        `All values of the union must be Schema. Received: ${schemas}`,
      );
    }
    this.schemas = schemas;
  }

  internalParse(
    originalValue: any,
  ): SafeParseReturn<S[number] extends ISchema<infer E> ? E : never> {
    let value = originalValue;
    if (typeof value === 'string') {
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

    let firstError: SafeParseReturn<any> | undefined;

    for (const schema of this.schemas) {
      const result = schema.safeParse(value);
      if (result.success) {
        return safeParseSuccess(result.data);
      }
      if (!firstError) {
        firstError = result;
      }
    }

    // return firstError ?? safeParseError('union_no_match', this, originalValue);
    return safeParseError('union_no_match', this, originalValue);
  }

  //
  //  Schema info about optional, required, default
  //

  declare optional: () => ISchema<
    | Exclude<S[number] extends ISchema<infer E> ? E : never, null>
    | null
    | undefined
  >;
  /** Set to default value when the value is null or undefined */
  declare default: (
    defaultSetter:
      | (() => S[number] extends ISchema<infer E> ? E : never)
      | (S[number] extends ISchema<infer E> ? E : never),
  ) => UnionSchema<S>;
  /**
   * Parse the value, throw {@link SafeParseReturn} when the value is invalid
   */
  declare parse: (
    originalValue: any,
  ) => S[number] extends ISchema<infer E> ? E : never;
  /**
   * Parse the value, return {@link SafeParseReturn} when the value is invalid
   */
  declare safeParse: (
    originalValue: any,
  ) => SafeParseReturn<S[number] extends ISchema<infer E> ? E : never>;

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

//
//

UnionSchema.prototype.optional = NewSchema.prototype.optional as any;
UnionSchema.prototype.default = NewSchema.prototype.default as any;
UnionSchema.prototype.safeParse = NewSchema.prototype.safeParse as any;
UnionSchema.prototype.parse = NewSchema.prototype.parse as any;
(UnionSchema.prototype as any).isSchema = true;

//
//

export function union<T extends ISchema<any>[]>(
  schemas: [...T],
): UnionSchema<T> {
  return new UnionSchema(schemas);
}
