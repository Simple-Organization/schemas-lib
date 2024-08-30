import type { SchemaMeta, SchemaParser } from '../types';
import { Issue } from '../Issue';
import { Schema } from './Schema';

//
//

export interface ArrayMeta extends SchemaMeta {
  element?: Schema<any>;
}

//
//

export class ArraySchema<
  T = any,
  U extends Schema<T> = Schema<T>,
> extends Schema<T> {
  element: U;
  declare meta: ArrayMeta;

  constructor(parsers: SchemaParser[], meta: ArrayMeta) {
    super(parsers, meta);

    if (meta.element === undefined) {
      throw new Error('You must provide a element to the array schema');
    }

    this.element = meta.element as any;
  }

  //
  //

  min(value: number): this {
    function minArrayLengthParser(
      value: any,
      meta: SchemaMeta,
      originalValue: any,
    ) {
      if (typeof meta.min === 'number' && value.length < meta.min) {
        return new Issue('min_array_length', meta, originalValue);
      }

      return value;
    }

    const clone = this.clone();
    clone.meta.min = value;
    clone.parsers.push(minArrayLengthParser);
    return clone;
  }

  //
  //

  max(value: number): this {
    function maxArrayLengthParser(
      value: any,
      meta: SchemaMeta,
      originalValue: any,
    ) {
      if (typeof meta.max === 'number' && value.length > meta.max) {
        return new Issue('max_array_length', meta, originalValue);
      }

      return value;
    }

    const clone = this.clone();
    clone.meta.max = value;
    clone.parsers.push(maxArrayLengthParser);
    return clone;
  }

  //
  //

  between(min: number, max: number): this {
    return this.min(min).max(max);
  }

  //
  //  Sobreescrita da tipagem métodos
  //

  declare optional: () => ArraySchema<Exclude<T, null> | undefined>;
  declare nullable: () => ArraySchema<Exclude<T, undefined> | null>;
  declare nullish: () => ArraySchema<T | null | undefined>;
  declare required: () => ArraySchema<Exclude<T, undefined | null>>;
  declare default: (
    defaultSetter?: T | null | (() => T),
  ) => ArraySchema<T | null | undefined>;
}
