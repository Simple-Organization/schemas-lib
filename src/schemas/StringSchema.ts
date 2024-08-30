import type { SchemaMeta } from '../types';
import { Issue } from '../Issue';
import { Schema } from './Schema';

//
//

export class StringSchema<T = string> extends Schema<T> {
  //
  //

  min(value: number): this {
    function minLengthParser(value: any, meta: SchemaMeta, originalValue: any) {
      if (typeof meta.min === 'number' && value.length < meta.min) {
        return new Issue('min_length', meta, originalValue);
      }
      return value;
    }

    const clone = this.clone();
    clone.meta.min = value;
    clone.parsers.push(minLengthParser);
    return clone;
  }

  //
  //

  max(value: number): this {
    function maxLengthParser(value: any, meta: SchemaMeta, originalValue: any) {
      if (typeof meta.max === 'number' && value.length > meta.max) {
        return new Issue('max_length', meta, originalValue);
      }
      return value;
    }

    const clone = this.clone();
    clone.meta.max = value;
    clone.parsers.push(maxLengthParser);
    return clone;
  }

  //
  //

  between(min: number, max: number): this {
    return this.min(min).max(max);
  }

  /**
   *
   * @param value
   * @returns
   */
  includes(value: string): typeof this {
    const clone = this.clone();
    clone.meta.includes = value;

    clone.parsers.push(function includesParser(value, meta, originalValue) {
      if (!value.includes(value)) {
        return new Issue('not_includes', meta, originalValue);
      }
      return value;
    });

    return clone;
  }

  //
  //  Sobreescrita da tipagem métodos
  //

  declare optional: () => StringSchema<Exclude<T, null> | undefined>;
  declare nullable: () => StringSchema<Exclude<T, undefined> | null>;
  declare nullish: () => StringSchema<T | null | undefined>;
  declare required: () => StringSchema<Exclude<T, undefined | null>>;
  /**
   * Set to default value when the value is null or undefined
   *
   * AND IT SETs TO NULLISH MODE
   */
  declare default: (
    defaultSetter?: T | null | (() => T),
  ) => StringSchema<T | null | undefined>;
}
