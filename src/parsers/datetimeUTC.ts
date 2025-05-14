import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';

//
//

export class DatetimeSchema extends Schema<string> {
  vMin?: number | undefined;
  vMax?: number | undefined;

  preprocess(p: ParseContext): void {
    // Boilerplate to normalize the value with trimming
    if (typeof p.value === 'string') {
      p.value = p.value.trim();
      if (p.value === '') p.value = null;
      else p.value = new Date(p.value);
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

  process(p: ParseContext): void {
    if (typeof p.value === 'number') {
      p.value = new Date(p.value);
    }

    if (p.value instanceof Date) {
      const time = p.value.getTime();

      if (Number.isNaN(time)) {
        return p.error('not_datetime_type');
      }

      if (this.vMin !== undefined && time < this.vMin) {
        return p.error('min_datetime', this.vMin);
      }

      if (this.vMax !== undefined && time > this.vMax) {
        return p.error('max_datetime', this.vMax);
      }

      p.value = p.value.toISOString().replace(/\.\d+Z$/, 'Z');
    }

    if (typeof p.value !== 'string') {
      return p.error('not_datetime_type');
    }
  }

  min(value: number | Date | string): this {
    this.vMin = new Date(value).getTime();
    return this;
  }

  max(value: number | Date | string): this {
    this.vMax = new Date(value).getTime();
    return this;
  }

  between(min: number | Date | string, max: number | Date | string): this {
    this.min(min);
    this.max(max);
    return this;
  }
}

/**
 * Datetime with UTC and without timezone
 *
 * Removes the milliseconds
 */
export function datetimeUTC() {
  return new DatetimeSchema();
}
