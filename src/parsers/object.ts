import type { ISchema, ParseContext, SafeParseReturn } from '../version2/types';
import { Schema } from '../version2/Schema';
import { jsonPreprocess } from '../preprocess/jsonPreprocess';

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

  /** Uses jsonPreprocess */
  declare preprocess: (p: ParseContext) => void;

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

    const shape = this.shape as any as Record<string, Schema<any>>;
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

ObjectSchema.prototype.optional = Schema.prototype.optional as any;
ObjectSchema.prototype.default = Schema.prototype.default as any;
ObjectSchema.prototype.safeParse = Schema.prototype.safeParse as any;
ObjectSchema.prototype.parse = Schema.prototype.parse as any;
ObjectSchema.prototype.preprocess = jsonPreprocess;
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
