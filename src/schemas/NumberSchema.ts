import { Issue } from '../Issue';
import { SchemaMeta } from '../types';
import { Schema } from './Schema';

//
//

export class NumberSchema<T = number> extends Schema<T> {
  //
  //  Sobreescrita da tipagem métodos
  //

  declare optional: () => NumberSchema<Exclude<T, null> | undefined>;
  declare nullable: () => NumberSchema<Exclude<T, undefined> | null>;
  declare nullish: () => NumberSchema<T | null | undefined>;
  declare required: () => NumberSchema<Exclude<T, undefined | null>>;

  /**
   * Set to default value when the value is null or undefined
   *
   * AND IT SETs TO NULLISH MODE
   */
  declare default: (
    defaultSetter?: T | null | (() => T),
  ) => NumberSchema<T | null | undefined>;

  //
  //

  min(value: number): this {
    function minNumberParser(value: any, meta: SchemaMeta, originalValue: any) {
      if (typeof meta.min === 'number' && value < meta.min) {
        return new Issue('min_number', meta, originalValue);
      }
      return value;
    }

    const clone = this.clone();
    clone.meta.min = value;
    clone.parsers.push(minNumberParser);
    return clone;
  }

  //
  //

  max(value: number): this {
    function maxNumberParser(value: any, meta: SchemaMeta, originalValue: any) {
      if (typeof meta.max === 'number' && value > meta.max) {
        return new Issue('max_number', meta, originalValue);
      }
      return value;
    }

    const clone = this.clone();
    clone.meta.max = value;
    clone.parsers.push(maxNumberParser);
    return clone;
  }

  //
  //

  between(min: number, max: number): this {
    return this.min(min).max(max);
  }
}
