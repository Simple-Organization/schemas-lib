import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { NewSchema, SafeParseReturn } from '../schemas/NewSchema';

//
//

export class DatetimeSchema extends NewSchema<string> {
  _safeParse(originalValue: any): SafeParseReturn<string> {
    let value = originalValue;

    if (typeof value === 'string') {
      value = value.trim();
      if (value === '') {
        value = undefined;
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
      value = value.toISOString();
    }

    if (typeof value === 'string') {
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)) {
        return safeParseError('not_utc_datetime_string', this, originalValue);
      }
      return safeParseSuccess(value);
    }

    return safeParseError('not_datetime_type', this, originalValue);
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
