import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { MinMaxSchema } from '../schemas/MinMaxSchema';
import { SafeParseReturn } from '../schemas/NewSchema';

//
//

export class DatetimeSchema extends MinMaxSchema<string> {
  _safeParse(originalValue: any): SafeParseReturn<string> {
    let value = originalValue;

    if (typeof value === 'string') {
      value = value.trim();
      if (value === '') {
        value = undefined;
      } else {
        value = new Date(value);
      }
    } else if (value === null) {
      value = undefined;
    }

    if (value === undefined) {
      if (this._required) {
        return safeParseError('required', this, originalValue);
      }
      if (this._default) {
        return safeParseSuccess(this._default());
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
    const min = this._safeParse(value);
    if (!min.success) {
      throw new Error(`Invalid min value: ${min.error}`);
    }

    const clone = this.clone();
    clone.vMin = new Date(min.data!).getTime();
    return clone;
  }

  max(value: number | Date | string): this {
    const max = this._safeParse(value);
    if (!max.success) {
      throw new Error(`Invalid max value: ${max.error}`);
    }

    const clone = this.clone();
    clone.vMax = new Date(max.data!).getTime();
    return clone;
  }

  between(min: number | Date | string, max: number | Date | string): this {
    const _min = this._safeParse(min);
    if (!_min.success) {
      throw new Error(`Invalid min value: ${_min.error}`);
    }

    const _max = this._safeParse(max);
    if (!_max.success) {
      throw new Error(`Invalid max value: ${_max.error}`);
    }

    const clone = this.clone();
    clone.vMin = new Date(_min.data!).getTime();
    clone.vMax = new Date(_max.data!).getTime();
    return clone;
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
