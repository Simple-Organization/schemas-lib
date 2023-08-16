import { Issue } from '../Issue';
import { SchemaMeta } from '../types';
import { addPrototypeMinMax } from '../utils/utils';
import { Schema } from './Schema';

//
//

export class NumberSchema<T = number> extends Schema<T> {
  declare min: (value: number) => typeof this;
  declare max: (value: number) => typeof this;
  declare between: (min: number, max: number) => typeof this;

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
    defaultSetter: T | ((value: null | undefined) => T),
  ) => NumberSchema<T | null | undefined>;
}

//
//

addPrototypeMinMax(
  NumberSchema,
  //
  //
  function minNumberParser(value: any, meta: SchemaMeta, originalValue: any) {
    if (typeof meta.min === 'number' && value < meta.min) {
      return new Issue('min_number', meta, originalValue);
    }
    return value;
  },
  //
  //
  function maxNumberParser(value: any, meta: SchemaMeta, originalValue: any) {
    if (typeof meta.max === 'number' && value > meta.max) {
      return new Issue('max_number', meta, originalValue);
    }
    return value;
  },
);
