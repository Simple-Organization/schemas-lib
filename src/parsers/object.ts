import type { ValidationErrorRecord } from '../validationErrors';
import {
  NewSchema,
  type ISchema,
  type SafeParseReturn,
} from '../schemas/NewSchema';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';

//
//

export type ObjectSchemaRecord = Record<string, ISchema<any>>;

//
//

type OptionalKeys<T extends ObjectSchemaRecord> = {
  [k in keyof T]: undefined extends T[k]['_o'] ? k : never;
}[keyof T];

type RequiredKeys<T extends ObjectSchemaRecord> = {
  [k in keyof T]: undefined extends T[k]['_o'] ? never : k;
}[keyof T];

// Concat required and optional keys
type MakePartial<T extends ObjectSchemaRecord> = {
  [k in RequiredKeys<T> as T[k] extends never ? never : k]: T[k]['_o'];
} & {
  [k in OptionalKeys<T> as T[k] extends never ? never : k]?: T[k]['_o'];
};

type Identity<T> = T;
type Flatten<T> = Identity<{ [k in keyof T]: T[k] }>;

//
//

export class ObjectSchema<
  R extends ObjectSchemaRecord,
  T = Flatten<MakePartial<R>>,
  // T = MakePartial<R>,
> implements ISchema<T>
{
  /** Property used only for type inference */
  declare readonly _o: T;
  declare readonly isSchema: true;

  req = true;
  strict = false;

  def?: () => T;
  parent?: ISchema<any>;

  //
  //

  constructor(readonly shape: R) {
    if (typeof shape !== 'object' || shape === null) {
      throw new Error(
        'You must provide a shape to the object schema and must be an object',
      );
    }
  }

  internalParse(originalValue: any): SafeParseReturn<T> {
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
    //  If the value is not an object, return an error

    if (typeof value !== 'object') {
      return safeParseError('not_object', this, originalValue);
    }

    //
    //  Validates each key of the object

    const shape = this.shape;
    const results: Record<string, SafeParseReturn<any>> = {};
    const output: Record<string, any> = {};

    for (const key of Object.keys(shape)) {
      results[key] = shape[key].safeParse(value[key]);

      if (!results[key].success) {
        // Worst error ever 😂😂😂
        return safeParseError('invalid_object_value', this, originalValue);
      }

      output[key] = results[key].data;
    }

    if (this.strict) {
      return this._strictParser(value, output, originalValue);
    }

    return safeParseSuccess(output as T);
  }

  private _strictParser(
    value: Record<string, any>,
    output: Record<string, any>,
    originalValue: any,
  ): SafeParseReturn<T> {
    const shapeKeys = Object.keys(this.shape!);
    const valueKeys = Object.keys(value);

    const extraKeys = valueKeys.filter((key) => !shapeKeys.includes(key));

    console.log('extraKeys', extraKeys);
    if (extraKeys.length > 0) {
      // Worst error ever 😂😂😂
      return safeParseError('object_extra_keys', this, originalValue);
    }

    return safeParseSuccess(output as T);
  }

  //
  //  Schema info about optional, required, default
  //

  declare optional: () => ISchema<Exclude<T, null> | null | undefined>;
  /** Set to default value when the value is null or undefined */
  declare default: (defaultSetter: (() => T) | T) => ObjectSchema<R, T>;
  /**
   * Parse the value, throw {@link SafeParseReturn} when the value is invalid
   */
  declare parse: (originalValue: any) => T;
  /**
   * Parse the value, return {@link SafeParseReturn} when the value is invalid
   */
  declare safeParse: (originalValue: any) => SafeParseReturn<T>;

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

//
//

ObjectSchema.prototype.optional = NewSchema.prototype.optional as any;
ObjectSchema.prototype.default = NewSchema.prototype.default as any;
ObjectSchema.prototype.safeParse = NewSchema.prototype.safeParse as any;
ObjectSchema.prototype.parse = NewSchema.prototype.parse as any;
(ObjectSchema.prototype as any).isSchema = true;

//
//

export function object<T extends ObjectSchemaRecord>(
  shape: T,
): ObjectSchema<T> {
  return new ObjectSchema(shape);
}

//
//

export function strict<T extends ObjectSchemaRecord>(
  shape: T,
): ObjectSchema<T> {
  const schema = new ObjectSchema(shape);
  schema.strict = true;
  return schema;
}
