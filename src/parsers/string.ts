import type { ParseContext } from '../version2/types';
import { Schema2 } from '../version2/Schema2';

//
//

export class StringSchema extends Schema2<string> {
  trim = true;
  vMin?: number | undefined;
  vMax?: number | undefined;

  /**
   * Coerce the value to a string or null if empty
   */
  preprocess(p: ParseContext): void {
    // Boilerplate to normalize the value with trimming
    if (typeof p.value === 'string') {
      if (this.trim) p.value = p.value.trim();
      if (p.value === '') p.value = null;
    } else if (p.value === undefined) p.value = null;

    if (p.value === null) {
      if (this.req) {
        return p.error('required');
      }

      if (this.def) {
        p.value = this.def();
        return;
      }
    }
  }

  //
  //

  process(p: ParseContext): void {
    if (typeof p.value !== 'string') {
      return p.error('not_string_type');
    }

    if (this.vMin !== undefined && p.value.length < this.vMin) {
      return p.error('min_number');
    }

    if (this.vMax !== undefined && p.value.length > this.vMax) {
      return p.error('max_number');
    }
  }

  min(value: number): this {
    this.vMin = value;
    return this;
  }
  max(value: number): this {
    this.vMax = value;
    return this;
  }
  between(min: number, max: number): this {
    this.vMin = min;
    this.vMax = max;
    return this;
  }
}

/**
 * A string with any length
 */
export function string() {
  const schema = new StringSchema();
  schema.trim = false;
  return schema;
}

/**
 * A string, but always trim in the start of the parse
 */
export function trimmed() {
  return new StringSchema();
}
