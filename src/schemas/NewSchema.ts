import type { ValidationErrorRecord } from '../validationErrors';
import { SchemaLibError } from '../SchemaLibError';

//
//

export type SafeParseReturn<T> = {
  success: boolean;
  data?: T;
  error?: SchemaLibError;
};

//
//

export type ISchema<T> = {
  parse: (originalValue: any) => T;
  safeParse: (originalValue: any) => SafeParseReturn<T>;
  optional: () => ISchema<Exclude<T, null> | null | undefined>;
  required: () => ISchema<Exclude<T, null> | undefined>;
  default: (defaultSetter: (() => T) | T) => ISchema<T>;
  clone: () => ISchema<T>;
  name?: string;
  parent?: ISchema<any>;
  _o?: T;
};

//
//

export abstract class NewSchema<T> {
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
    const clone = new (this.constructor as any)() as NewSchema<T>;
    clone.req = this.req;
    clone.def = this.def;
    clone.name = this.name;
    clone.parent = this.parent;
    return clone as any;
  }

  abstract internalParse(originalValue: any): SafeParseReturn<T>;

  //
  //  Schema info about optional, required
  //

  optional(): NewSchema<Exclude<T, null> | null | undefined> {
    const clone = this.clone();
    clone.req = false;
    return clone as any;
  }

  required(): NewSchema<Exclude<T, null> | undefined> {
    const clone = this.clone();
    clone.req = true;
    return clone as any;
  }

  /**
   * Set to default value when the value is null or undefined
   */
  default(defaultSetter: (() => T) | T): NewSchema<T> {
    const clone = this.clone();
    clone.def = (
      typeof defaultSetter === 'function' ? defaultSetter : () => defaultSetter
    ) as () => T;
    return clone as any;
  }

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

  abstract getErrors(): ValidationErrorRecord;
}

//
//

export const defaultValidationErrors: ValidationErrorRecord = {
  required: 'O campo é obrigatório',
};
