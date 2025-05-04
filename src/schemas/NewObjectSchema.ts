import type { ValidationErrorRecord } from '../validationErrors';
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

export abstract class NewObjectSchema<
  R extends ObjectSchemaRecord,
  T = MakePartial<R>,
> implements ISchema<T>
{
  /** Property used only for type inference */
  declare readonly _o: T;
  req = true;
  def?: () => T;
  name?: string;
  parent?: ISchema<any>;

  //
  //  Important methods
  //

  clone(): typeof this {
    const clone = new (this.constructor as any)() as typeof this;
    clone.req = this.req;
    clone.def = this.def;
    clone.name = this.name;
    clone.parent = this.parent;
    return clone;
  }

  abstract internalParse(originalValue: any): SafeParseReturn<T>;

  //
  //  Schema info about optional, required, default
  //

  declare optional: () => ISchema<Exclude<T, null> | null | undefined>;
  declare required: () => ISchema<Exclude<T, null> | undefined>;
  /** Set to default value when the value is null or undefined */
  declare default: (defaultSetter: (() => T) | T) => NewObjectSchema<R, T>;

  /**
   * Parse the value, return Issue when the value is invalid
   */
  safeParse(originalValue: any): SafeParseReturn<T> {
    const parsed = this.internalParse(originalValue);

    if (parsed.error && this.def) {
      return {
        data: this.def(),
        success: true,
      };
    }

    return parsed;
  }

  /**
   * Parse the value, throw IssueError when the value is invalid
   */
  parse(originalValue: any): T {
    const parsed = this.safeParse(originalValue);

    if (parsed.error) {
      throw parsed;
    }

    return parsed.data!;
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

//
//

NewObjectSchema.prototype.required = NewSchema.prototype.required as any;
NewObjectSchema.prototype.optional = NewSchema.prototype.optional as any;
NewObjectSchema.prototype.default = NewSchema.prototype.default as any;
