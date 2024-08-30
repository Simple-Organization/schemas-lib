import type { SchemaMeta } from '../types';
import { Issue } from '../Issue';
import { Schema } from './Schema';

//
//

export interface DatetimeMeta extends SchemaMeta {
  /**
   * Converts to date and then to UTC string again
   *
   * This is to ensure that the date is in the correct format
   *
   * @default true
   */
  ensure?: boolean;

  /**
   * Check if the year is between 2015 and 2030
   *
   * @default true
   */
  closeCurrent?: boolean;
}

//
//

export class DatetimeSchema<T = string> extends Schema<T> {
  declare meta: DatetimeMeta;

  /**
   * If the value is a Date, it will mutate toISOString()
   */
  min(value: string | Date): this {
    function minDatetimeParser(
      value: any,
      meta: SchemaMeta,
      originalValue: any,
    ) {
      if (meta.min instanceof Date) {
        meta.min = meta.min.toISOString();
      }

      if (typeof meta.min === 'string' && value < meta.min) {
        return new Issue('min_datetime', meta, originalValue);
      }
      return value;
    }

    const clone = this.clone();
    clone.meta.min = value;
    clone.parsers.push(minDatetimeParser);
    return clone;
  }

  /**
   * If the value is a Date, it will mutate toISOString()
   */
  max(value: string | Date): this {
    function maxDatetimeParser(
      value: any,
      meta: SchemaMeta,
      originalValue: any,
    ) {
      if (meta.min instanceof Date) {
        meta.min = meta.min.toISOString();
      }

      if (typeof meta.max === 'string' && value < meta.max) {
        return new Issue('max_datetime', meta, originalValue);
      }
      return value;
    }

    const clone = this.clone();
    clone.meta.max = value;
    clone.parsers.push(maxDatetimeParser);
    return clone;
  }

  /**
   * If the value is a Date, it will mutate toISOString()
   */
  between(min: string | Date, max: string | Date): this {
    return this.min(min).max(max);
  }

  /**
   * Converts to date and then to UTC string again
   *
   * This is to ensure that the date is in the correct format
   *
   * value = new Date(value).toUTCString();
   *
   * @default true
   */
  ensure(enabled: boolean): DatetimeSchema<T> {
    const clone = this.clone();
    clone.meta.ensure = enabled;
    return clone;
  }

  /**
   * Check if the year is between 2015 and 2030
   *
   * @default true
   */
  closeCurrent(enabled: boolean): DatetimeSchema<T> {
    const clone = this.clone();
    clone.meta.closeCurrent = enabled;
    return clone;
  }

  //
  //  Sobreescrita da tipagem métodos
  //

  declare optional: () => DatetimeSchema<Exclude<T, null> | undefined>;
  declare nullable: () => DatetimeSchema<Exclude<T, undefined> | null>;
  declare nullish: () => DatetimeSchema<T | null | undefined>;
  declare required: () => DatetimeSchema<Exclude<T, undefined | null>>;
  /**
   * Set to default value when the value is null or undefined
   *
   * AND IT SETs TO NULLISH MODE
   */
  declare default: (
    defaultSetter?: T | null | (() => T),
  ) => DatetimeSchema<T | null | undefined>;
}
