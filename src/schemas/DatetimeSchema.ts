import type { SchemaMeta } from '../types';
import { Issue } from '../Issue';
import { Schema } from './Schema';
import { addPrototypeMinMax } from '../utils/utils';

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
  declare min: (value: string | Date) => typeof this;
  /**
   * If the value is a Date, it will mutate toISOString()
   */
  declare max: (value: string | Date) => typeof this;
  /**
   * If the value is a Date, it will mutate toISOString()
   */
  declare between: (min: string | Date, max: string | Date) => typeof this;

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
    defaultSetter: T | ((value: null | undefined) => T),
  ) => DatetimeSchema<T | null | undefined>;
}

//
//

addPrototypeMinMax(
  DatetimeSchema,
  //
  //
  function minDatetimeParser(value: any, meta: SchemaMeta, originalValue: any) {
    if (meta.min instanceof Date) {
      meta.min = meta.min.toISOString();
    }

    if (typeof meta.min === 'string' && value < meta.min) {
      return new Issue('min_datetime', meta, originalValue);
    }
    return value;
  },
  //
  //
  function maxDatetimeParser(value: any, meta: SchemaMeta, originalValue: any) {
    if (meta.min instanceof Date) {
      meta.min = meta.min.toISOString();
    }

    if (typeof meta.max === 'string' && value < meta.max) {
      return new Issue('max_datetime', meta, originalValue);
    }
    return value;
  },
);
