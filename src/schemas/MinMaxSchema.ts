import type { SchemaLibError } from '../SchemaLibError';
import type { ValidationErrorRecord } from '../validationErrors';
import { Schema, type ISchema } from './Schema';

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
  declare readonly isSchema: true;
  req = true;
  def?: () => T;
  vMin: number | undefined;
  vMax: number | undefined;

  //
  //  Important methods
  //

  abstract internalParse(originalValue: any): SafeParseReturn<T>;
  abstract getErrors(): ValidationErrorRecord;

  //
  //  Schema info about optional, required, default
  //

  declare optional: () => MinMaxSchema<Exclude<T, null> | null | undefined>;
  /** Set to default value when the value is null or undefined */
  declare default: (defaultSetter: (() => T) | T) => MinMaxSchema<T>;

  /**
   * Parse the value, return Issue when the value is invalid
   */
  safeParse(originalValue: any): SafeParseReturn<T> {
    return this.internalParse(originalValue);
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
    this.vMin = value;
    return this;
  }

  //
  //

  max(value: number): this {
    this.vMax = value;
    return this;
  }

  //
  //

  between(min: number, max: number): this {
    this.vMin = min;
    this.vMax = max;
    return this;
  }
}

//
//

MinMaxSchema.prototype.optional = Schema.prototype.optional as any;
MinMaxSchema.prototype.default = Schema.prototype.default as any;
(MinMaxSchema.prototype as any).isSchema = true;
