import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { MinMaxSchema } from '../schemas/MinMaxSchema';
import type { SafeParseReturn } from '../schemas/Schema';

//
//

export class DatetimeSchema extends MinMaxSchema<string> {
  internalParse(originalValue: any): SafeParseReturn<string> {
    let value = originalValue;

    if (typeof value === 'string') {
      value = value.trim();
      if (value === '') {
        value = null;
      } else {
        value = new Date(value);
      }
    } else if (value === undefined) {
      value = null;
    }

    if (value === null) {
      if (this.req) {
        return safeParseError('required', this, originalValue);
      }
      if (this.def) {
        return safeParseSuccess(this.def());
      }
      return safeParseSuccess();
    }

    if (typeof value === 'number') {
      value = new Date(value);
    }

    if (value instanceof Date) {
      const time = value.getTime();

      if (Number.isNaN(time)) {
        return safeParseError('not_datetime_type', this, originalValue);
      }

      if (this.vMin !== undefined && time < this.vMin) {
        return safeParseError('min_datetime', this, originalValue);
      }

      if (this.vMax !== undefined && time > this.vMax) {
        return safeParseError('max_datetime', this, originalValue);
      }

      value = value.toISOString().replace(/\.\d+Z$/, 'Z');
    }

    if (typeof value === 'string') {
      // if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)) {
      //   return safeParseError('not_utc_datetime_string', this, originalValue);
      // }
      return safeParseSuccess(value);
    }

    return safeParseError('not_datetime_type', this, originalValue);
  }

  min(value: number | Date | string): this {
    const min = this.internalParse(value);
    if (!min.success) {
      throw new Error(`Invalid min value: ${min.error}`);
    }

    this.vMin = new Date(min.data!).getTime();
    return this;
  }

  max(value: number | Date | string): this {
    const max = this.internalParse(value);
    if (!max.success) {
      throw new Error(`Invalid max value: ${max.error}`);
    }

    this.vMax = new Date(max.data!).getTime();
    return this;
  }

  between(min: number | Date | string, max: number | Date | string): this {
    this.min(min);
    this.max(max);
    return this;
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
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
