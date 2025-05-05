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

export type Infer<T extends Schema<any>> = T['_o'];

//
//

export abstract class Schema<T> {
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

  optional(): Schema<Exclude<T, null> | null | undefined> {
    this.req = false;
    return this as any;
  }

  /**
   * Set to default value when the value is null or undefined
   */
  default(defaultSetter: (() => T) | T): Schema<T> {
    this.def = (
      typeof defaultSetter === 'function' ? defaultSetter : () => defaultSetter
    ) as () => T;
    this.req = false;
    return this;
  }

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

  abstract getErrors(): ValidationErrorRecord;
}

//
//

(Schema.prototype as any).isSchema = true;
