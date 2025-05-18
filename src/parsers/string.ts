import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';
import { EMPTY_VALUE } from '../symbols';

//
//

export class StringSchema extends Schema<string> {
  trim = true;
  vMin: number | null = null;
  vMax: number | null = null;

  /**
   * Coerce the value to a string or null if empty
   */
  preprocess(p: ParseContext): void {
    // Boilerplate to normalize the value with trimming
    if (typeof p.value === 'string') {
      if (this.trim) {
        p.value = p.value.trim();
      }

      if (p.value === '') {
        p.value = EMPTY_VALUE;
      }
    } else if (p.value === undefined) {
      p.value = EMPTY_VALUE;
    } else if (p.value === null) {
      p.value = EMPTY_VALUE;
    }
  }

  //
  //

  process(p: ParseContext): void {
    if (typeof p.value !== 'string') {
      return p.error('not_string_type');
    }

    if (this.vMin !== null && p.value.length < this.vMin) {
      return p.error('min_number');
    }

    if (this.vMax !== null && p.value.length > this.vMax) {
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
