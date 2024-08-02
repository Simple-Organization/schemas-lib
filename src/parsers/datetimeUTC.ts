import { Issue } from '../Issue';
import { DatetimeMeta, DatetimeSchema } from '../schemas/DatetimeSchema';

export function datetimeParser(
  value: any,
  meta: DatetimeMeta,
  originalValue: any,
): Issue | string {
  if (typeof value === 'number') {
    value = new Date(value);
  }

  if (value instanceof Date) {
    value = value.toISOString();
  }

  if (typeof value === 'string') {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)) {
      return new Issue('not_utc_datetime_string', meta, originalValue);
    }

    if (meta.ensure !== false) {
      //
      // Converts to date and then to UTC string again
      // This is to ensure that the date is in the correct format
      value = new Date(value).toISOString();
    }

    if (meta.closeCurrent !== false) {
      const year = +value.substring(0, 4);

      if (year < 2015 || year > 2030) {
        return new Issue('datetime_out_range', meta, originalValue);
      }
    }

    if (/\.\d+Z$/.test(value)) {
      return value.replace(/\.\d+Z$/, 'Z');
    }
  }

  return value;
}

/**
 * Datetime with UTC and without timezone
 *
 * Removes the milliseconds
 */
export const datetimeUTC = new DatetimeSchema([datetimeParser], { jsType: 'string' });
