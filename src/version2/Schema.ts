import type { ParseContext, SafeParseReturn } from './types';
import { getErrorMessage } from './getErrorMessage';
import { SchemaLibError } from '../SchemaLibError';

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

  abstract process(c: ParseContext): void;

  /**
   * Preprocess the value, return Issue when the value is invalid
   */
  preprocess(p: ParseContext): void {
    // Boilerplate to normalize the value without trimming
    if (p.value === '') p.value = null;
    else if (p.value === undefined) p.value = null;

    if (p.value === null) {
      if (this.req) return p.error('required');
      if (this.def) {
        p.value = this.def();
        return;
      }
    }
  }

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
    const c: ParseContext = {
      value: originalValue,
      original: originalValue,
      schema: this,
      hasError: false,
      issues: [],
      path: [],
      error: (code) => {
        c.hasError = true;

        let message = getErrorMessage(code, c);
        if (!message) {
          message = `Error ${code} not found`;
        }

        c.issues.push({
          code,
          message: message,
          value: c.value,
          original: c.original,
          path: c.path,
        });
      },
    };

    this.preprocess(c);
    if (c.hasError) {
      return {
        error: new SchemaLibError(c.issues[0].code as any, this, c.original),
        success: false,
      };
    } else if (c.value === null) {
      return {
        data: null as any,
        success: true,
      };
    }

    this.process(c);
    if (c.hasError) {
      return {
        error: new SchemaLibError(c.issues[0].code as any, this, c.original),
        success: false,
      };
    }

    return {
      data: c.value,
      success: true,
    };
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
}

//
//

(Schema.prototype as any).isSchema = true;
