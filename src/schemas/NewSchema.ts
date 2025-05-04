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
  readonly _o?: T;
  readonly isSchema: true;
  parse: (originalValue: any) => T;
  safeParse: (originalValue: any) => SafeParseReturn<T>;
  optional: () => ISchema<Exclude<T, null> | null | undefined>;
  default: (defaultSetter: (() => T) | T) => ISchema<T>;
};

//
//

export abstract class NewSchema<T> {
  /** Property used only for type inference */
  declare readonly _o: T;
  declare readonly isSchema: true;
  req = true;
  def?: () => T;

  //
  //  Important methods
  //

  abstract internalParse(originalValue: any): SafeParseReturn<T>;

  //
  //  Schema info about optional, required
  //

  optional(): NewSchema<Exclude<T, null> | null | undefined> {
    this.req = false;
    return this as any;
  }

  /**
   * Set to default value when the value is null or undefined
   */
  default(defaultSetter: (() => T) | T): NewSchema<T> {
    this.def = (
      typeof defaultSetter === 'function' ? defaultSetter : () => defaultSetter
    ) as () => T;
    return this;
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

(NewSchema.prototype as any).isSchema = true;

//
//

export const defaultValidationErrors: ValidationErrorRecord = {
  required: 'O campo é obrigatório',
};
