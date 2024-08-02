import type { ObjectSchema } from './schemas/ObjectSchema';
import type { Schema } from './schemas/Schema';

//
//

export const trueOptions = [true, 1, 'true', '1', 'on'] as const;
export const falseOptions = [false, 0, 'false', '0', 'off'] as const;

//
//

export type Infer<T extends Schema<any>> = T['_o'];

/**
 * Information about a schema
 *
 * Changing things like `optional`, `min`, `max` will change
 * how the Schema behaves
 */
export type SchemaMeta = {
  /** Schema javascript type */
  jsType?: string;
  /** Schema named javascript type when is a child of a object */
  namedJSType?: string;

  /**
   * Schema empty mode
   * @default 'required'
   */
  mode?: 'required' | 'optional' | 'nullable' | 'nullish';

  //
  //  Schema info
  //

  /** Property name, is given by `object()` */
  name?: string;

  default?: (value: null | undefined) => any;

  //
  //  enumType info
  enum?: string[];

  //
  //  mixin info
  mixin?: Schema<any>[];

  //
  //  literal info
  literal?: any;

  //
  //  distinct info
  distinctProp?: string;
  distinctObjs?: Map<string, ObjectSchema<any>>;

  /**
   * Min used for most parsers
   *
   * - `NumberSchema`: min value `number`
   * - `StringSchema`: min length `number`
   * - `ArraySchema`: min length `number`
   * - `DatetimeSchema`: min date `string`
   */
  min?: number | string | Date;

  /**
   * Max used for most parsers
   *
   * - `NumberSchema`: max value `number`
   * - `StringSchema`: max length `number`
   * - `ArraySchema`: max length `number`
   * - `DatetimeSchema`: max date `string | Date`
   */
  max?: number | string | Date;

  /**
   * If a string is included in the string
   */
  includes?: string;

  /**
   * Front proprerties
   */

  description?: string;
  helperText?: string;

  /**
   * Custom validation error
   */
  errors?: Record<
    string,
    string | ((originalValue: any, meta: SchemaMeta) => string)
  >;

  [k: string]: any;
};

//
//

export type Mutator = (schema: Schema<any>) => void;

//
//

export type SchemaParser = (
  value: any,
  meta: SchemaMeta,
  originalValue: any,
) => any;
