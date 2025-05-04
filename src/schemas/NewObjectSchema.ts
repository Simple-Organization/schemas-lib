import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { NewSchema, type ISchema, type SafeParseReturn } from './NewSchema';

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

//
//

export class NewObjectSchema<R extends ObjectSchemaRecord, T = MakePartial<R>>
  implements ISchema<T>
{
  /** Property used only for type inference */
  declare readonly _o: T;
  declare readonly isSchema: true;
  req = true;
  def?: () => T;
  name?: string;
  parent?: ISchema<any>;

  //
  //

  constructor(public shape: R) {
    if (typeof shape !== 'object' || shape === null) {
      throw new Error(
        'You must provide a shape to the object schema and must be an object',
      );
    }

    //
    //  Creates the shape and clones all child schemas
    //  giving the parent schema to them and setting the name
    let clone: ISchema<any>;

    for (const key of Object.keys(shape)) {
      if (!('isSchema' in shape[key])) {
        throw new Error(
          `Expected value['${key}'] to be a instance of Schema, but received: ${shape[key]}`,
        );
      }

      clone = shape[key].clone();
      clone.name = key;
      clone.parent = this;
      (shape as any)[key] = clone;
    }
  }

  //
  //  Important methods
  //

  clone(): typeof this {
    const clone = new (this.constructor as any)(this.shape) as typeof this;
    clone.req = this.req;
    clone.def = this.def;
    clone.name = this.name;
    clone.parent = this.parent;
    return clone;
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

    return null as any;
  }

  //
  //  Schema info about optional, required, default
  //

  declare optional: () => ISchema<Exclude<T, null> | null | undefined>;
  declare required: () => ISchema<Exclude<T, null> | undefined>;
  /** Set to default value when the value is null or undefined */
  declare default: (defaultSetter: (() => T) | T) => NewObjectSchema<R, T>;
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

NewObjectSchema.prototype.required = NewSchema.prototype.required as any;
NewObjectSchema.prototype.optional = NewSchema.prototype.optional as any;
NewObjectSchema.prototype.default = NewSchema.prototype.default as any;
NewObjectSchema.prototype.safeParse = NewSchema.prototype.safeParse as any;
NewObjectSchema.prototype.parse = NewSchema.prototype.parse as any;
(NewObjectSchema.prototype as any).isSchema = true;
