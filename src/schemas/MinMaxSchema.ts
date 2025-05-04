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

/**
 * Schema que permite definir valores minimos e maximos
 */
export abstract class MinMaxSchema<T> {
  /** Property used only for type inference */
  declare readonly _o: T;
  _required = true;
  _default?: () => T;
  vMin: number | undefined;
  vMax: number | undefined;

  //
  //  Important methods
  //

  clone(): typeof this {
    const clone = new (this.constructor as any)();
    clone._required = this._required;
    clone._default = this._default;
    clone._min = this.vMin;
    clone._max = this.vMax;
    return /* @__PURE__ */ clone;
  }

  abstract _safeParse(originalValue: any): SafeParseReturn<T>;

  //
  //  Schema info about optional, required
  //

  optional(): MinMaxSchema<Exclude<T, null> | null | undefined> {
    const clone = /* @__PURE__ */ this.clone();
    clone._required = false;
    return /* @__PURE__ */ clone as any;
  }

  required(): MinMaxSchema<Exclude<T, null> | undefined> {
    const clone = /* @__PURE__ */ this.clone();
    clone._required = true;
    return /* @__PURE__ */ clone as any;
  }

  /**
   * Set to default value when the value is null or undefined
   */
  default(defaultSetter: (() => T) | T): MinMaxSchema<T | null | undefined> {
    const clone = /* @__PURE__ */ this.clone();
    clone._default = (
      typeof defaultSetter === 'function' ? defaultSetter : () => defaultSetter
    ) as () => T;
    return clone as any;
  }

  /**
   * Parse the value, return Issue when the value is invalid
   */
  safeParse(originalValue: any): SafeParseReturn<T> {
    const parsed = this._safeParse(originalValue);

    if (parsed.error && this._default) {
      return {
        data: this._default(),
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
