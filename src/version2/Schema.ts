import type { ParseContext, SafeParseReturn } from './types';
import { getErrorMessage } from './getErrorMessage';
import { SchemaLibError } from '../SchemaLibError';
import { EMPTY_VALUE } from '../symbols';

//
//

export abstract class Schema<T> {
  /** Property used only for type inference */
  declare readonly _o: T;
  declare readonly isSchema: true;
  /** @internal */
  req = true;
  /** @internal */
  def: (() => T) | null | typeof EMPTY_VALUE = null;

  //
  //  Important methods
  //

  abstract process(p: ParseContext): void;

  /**
   * Preprocess the value, return Issue when the value is invalid
   */
  preprocess(p: ParseContext): void {
    // Boilerplate to normalize the value without trimming
    if (p.value === '') p.value = EMPTY_VALUE;
    else if (p.value === undefined) p.value = EMPTY_VALUE;
    else if (p.value === null) p.value = EMPTY_VALUE;
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
  default(defaultSetter?: (() => T) | T | null | undefined): Schema<T> {
    if (defaultSetter === undefined || defaultSetter === null) {
      this.def = EMPTY_VALUE;
      this.req = false;
      return this;
    }

    this.def = (
      typeof defaultSetter === 'function' ? defaultSetter : () => defaultSetter
    ) as () => T;
    this.req = false;
    return this;
  }

  processEmpty(p: ParseContext): any {
    if (this.def) {
      if (this.def === EMPTY_VALUE) {
        return p.empty;
      }

      return this.def();
    }

    if (this.req) {
      return p.error('required');
    }

    return p.empty;
  }

  /**
   * Parse the value, return Issue when the value is invalid
   * @param originalValue The value to parse
   * @param empty The value to use when the value is empty
   */
  safeParse(
    originalValue: any,
    empty: '' | null | undefined = undefined,
  ): SafeParseReturn<T> {
    const p: ParseContext = {
      value: originalValue,
      original: originalValue,
      schema: this,
      hasError: false,
      issues: [],
      path: [],
      empty,
      error: (code, addon) => {
        p.hasError = true;

        let message = getErrorMessage(code, p, addon);
        if (!message) {
          message = `Error ${code} not found`;
        }

        p.issues.push({
          code,
          message: message,
          value: p.value,
          original: p.original,
          path: p.path,
        });
      },
    };

    this.preprocess(p);

    if (p.value === EMPTY_VALUE) {
      p.value = this.processEmpty(p);

      if (p.hasError) {
        return {
          error: new SchemaLibError(p.issues),
          success: false,
        };
      }

      return {
        data: p.value,
        success: true,
      };
    } else if (p.hasError) {
      return {
        error: new SchemaLibError(p.issues),
        success: false,
      };
    }

    this.process(p);

    if (p.value === EMPTY_VALUE) {
      p.value = this.processEmpty(p);

      if (p.hasError) {
        return {
          error: new SchemaLibError(p.issues),
          success: false,
        };
      }

      return {
        data: null as any,
        success: true,
      };
    } else if (p.hasError) {
      return {
        error: new SchemaLibError(p.issues),
        success: false,
      };
    }

    return {
      data: p.value,
      success: true,
    };
  }

  /**
   * Parse the value, throw IssueError when the value is invalid
   */
  parse(originalValue: any): T {
    const parsed = this.safeParse(originalValue);

    if ('error' in parsed) {
      throw parsed.error;
    }

    return parsed.data;
  }

  /**
   * Modifica o valor enviado, só é executado se o valor for válido pelos parsers anteriores
   */
  transform<U>(fn: (value: T) => U): Schema<U> {
    const processCopy = this.process.bind(this);
    this.process = (p: ParseContext) => {
      processCopy(p);
      if (p.hasError) return;
      p.value = fn(p.value);
    };

    return this as any;
  }
}

//
//

(Schema.prototype as any).isSchema = true;
