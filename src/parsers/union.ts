import type { ValidationErrorRecord } from '../validationErrors';
import {
  NewSchema,
  type ISchema,
  type SafeParseReturn,
} from '../schemas/NewSchema';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';

//
//

// Utilitário para extrair o tipo de saída de um ISchema
type OutputOf<T> = T extends ISchema<infer O> ? O : never;

export class UnionSchema<S extends readonly ISchema<any>[]>
  implements ISchema<OutputOf<S[number]>>
{
  schemas: S;
  /** Property used only for type inference */
  declare readonly _o: OutputOf<S[number]>;
  declare readonly isSchema: true;

  req = true;

  def?: () => OutputOf<S[number]>;

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

  internalParse(originalValue: any): SafeParseReturn<OutputOf<S[number]>> {
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
        return safeParseSuccess(result.data as OutputOf<S[number]>);
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
    Exclude<OutputOf<S[number]>, null> | null | undefined
  >;
  /** Set to default value when the value is null or undefined */
  declare default: (
    defaultSetter: (() => OutputOf<S[number]>) | OutputOf<S[number]>,
  ) => UnionSchema<S>;
  /**
   * Parse the value, throw {@link SafeParseReturn} when the value is invalid
   */
  declare parse: (originalValue: any) => OutputOf<S[number]>;
  /**
   * Parse the value, return {@link SafeParseReturn} when the value is invalid
   */
  declare safeParse: (
    originalValue: any,
  ) => SafeParseReturn<OutputOf<S[number]>>;

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

export function union<T extends readonly ISchema<any>[]>(
  schemas: T,
): UnionSchema<T> {
  return new UnionSchema(schemas);
}
