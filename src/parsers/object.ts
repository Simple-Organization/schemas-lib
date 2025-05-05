import type { ISchema, SafeParseReturn } from '../schemas/Schema';
import { Schema2 } from '../version2/Schema2';
import type { ParseContext } from '../version2/types';

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

  //
  //

  constructor(readonly shape: R) {
    if (typeof shape !== 'object' || shape === null) {
      throw new Error(
        'You must provide a shape to the object schema and must be an object',
      );
    }
  }

  /**
   * Coerce the value to a number or null if empty
   */
  preprocess(p: ParseContext): void {
    if (typeof p.value === 'string') {
      if (p.value === '') p.value = null;
      else
        try {
          p.value = JSON.parse(p.value);
        } catch {
          return p.error('not_valid_json');
        }
    } else if (p.value === undefined) {
      p.value = null;
    }

    if (p.value === null) {
      if (this.req) {
        return p.error('required');
      }

      if (this.def) {
        p.value = this.def();
        return;
      }
    }
  }

  //
  //

  process(p: ParseContext): void {
    //
    //  If the value is not an object, return an error

    if (typeof p.value !== 'object') {
      return p.error('not_object');
    }

    //
    //  Validates each key of the object

    const shape = this.shape as any as Record<string, Schema2<any>>;
    const output: Record<string, any> = {};

    //
    // Saves the previous state of ParseContext
    const { value: values, original, path } = p;

    let hasError = false;

    //
    //

    for (const key of Object.keys(shape)) {
      path.push(key);
      p.value = values[key];
      p.original = values[key];
      p.schema = shape[key];
      p.hasError = false;

      shape[key].preprocess(p);

      if (p.hasError) {
        hasError = true;
        output[key] = p.value;
        path.pop();
        continue;
      } else if (p.value === null) {
        output[key] = p.value;
        path.pop();
        continue;
      }

      shape[key].process(p);
      if (p.hasError) {
        hasError = true;
      }

      output[key] = p.value;
      path.pop();
    }

    p.value = values;
    p.original = original;
    p.schema = this;
    p.hasError = hasError;

    if (hasError) {
      p.value = output as T;
      return p.error('object_invalid');
    }

    if (this.strict) {
      return this._strictParser(p, output);
    }

    p.value = output as T;
  }

  //
  //

  private _strictParser(p: ParseContext, output: Record<string, any>): void {
    const shapeKeys = Object.keys(this.shape!);
    const valueKeys = Object.keys(p.value);

    const extraKeys = valueKeys.filter((key) => !shapeKeys.includes(key));

    if (extraKeys.length > 0) {
      return p.error('object_extra_keys', extraKeys);
    }

    p.value = output;
  }

  //
  //  Schema info about optional, required, default
  //

  declare optional: () => ISchema<Exclude<T, null> | null | undefined>;
  declare default: (defaultSetter: (() => T) | T) => ObjectSchema<R, T>;
  declare parse: (originalValue: any) => T;
  declare safeParse: (originalValue: any) => SafeParseReturn<T>;
}

//
//

ObjectSchema.prototype.optional = Schema2.prototype.optional as any;
ObjectSchema.prototype.default = Schema2.prototype.default as any;
ObjectSchema.prototype.safeParse = Schema2.prototype.safeParse as any;
ObjectSchema.prototype.parse = Schema2.prototype.parse as any;
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
