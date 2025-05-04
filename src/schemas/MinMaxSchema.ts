import type { SchemaLibError } from '../SchemaLibError';
import type { ValidationErrorRecord } from '../validationErrors';
import type { ISchema } from './NewSchema';

//
//

export type SafeParseReturn<T> = {
  success: boolean;
  data?: T;
  error?: SchemaLibError;
};

//
//

/**
 * Schema que permite definir valores minimos e maximos
 */
export abstract class MinMaxSchema<T> implements ISchema<T> {
  /** Property used only for type inference */
  declare readonly _o: T;
  req = true;
  def?: () => T;
  name?: string;
  parent?: ISchema<any>;
  vMin: number | undefined;
  vMax: number | undefined;

  //
  //  Important methods
  //

  clone(): typeof this {
    const clone = new (this.constructor as any)() as MinMaxSchema<T>;
    clone.req = this.req;
    clone.def = this.def;
    clone.name = this.name;
    clone.parent = this.parent;

    clone.vMin = this.vMin;
    clone.vMax = this.vMax;
    return clone as any;
  }

  abstract internalParse(originalValue: any): SafeParseReturn<T>;
  abstract getErrors(): ValidationErrorRecord;

  //
  //  Schema info about optional, required
  //

  optional(): MinMaxSchema<Exclude<T, null> | null | undefined> {
    const clone = this.clone();
    clone.req = false;
    return clone as any;
  }

  required(): MinMaxSchema<Exclude<T, null> | undefined> {
    const clone = this.clone();
    clone.req = true;
    return clone as any;
  }

  /**
   * Set to default value when the value is null or undefined
   */
  default(defaultSetter: (() => T) | T): MinMaxSchema<T | null | undefined> {
    const clone = /* @__PURE__ */ this.clone();
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

  //
  //

  min(value: number): this {
    const clone = this.clone();
    clone.vMin = value;
    return clone;
  }

  //
  //

  max(value: number): this {
    const clone = this.clone();
    clone.vMax = value;
    return clone;
  }

  //
  //

  between(min: number, max: number): this {
    const clone = this.clone();
    clone.vMin = min;
    clone.vMax = max;
    return clone;
  }
}
