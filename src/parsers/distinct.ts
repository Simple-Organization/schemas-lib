import type { SchemaMeta } from '../types';
import { Issue } from '../Issue';
import { Schema } from '../schemas/Schema';
import { setDefaultMeta } from '../utils/utils';
import { ObjectSchema } from '../schemas/ObjectSchema';

//
//

export function literalParser(
  value: any,
  meta: SchemaMeta,
  originalValue: any,
): Issue | string {
  if (value !== meta.literal) {
    return new Issue('not_literal_equal', meta, originalValue);
  }

  return value;
}

//
//

export type Primitive = string | number | bigint | boolean | null | undefined;

//
//

/**
 * Support for literal values different than symbol
 */
export function literal<T extends Primitive>(value: T): Schema<T> {
  const schema = new Schema<any>([literalParser]);

  schema.meta.literal = value as any;

  //
  //  Dev generation values

  if (__DEV__) {
    if (
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      typeof value !== 'bigint' &&
      typeof value !== 'boolean' &&
      value !== null &&
      value !== undefined
    ) {
      throw new Error(
        `The literal value must be a primitive different than symbol. Received: ${value}`,
      );
    }

    setDefaultMeta(
      schema,
      `${typeof value === 'string' ? `"${value}"` : value}`,
      'TEXT',
    );
  }

  return schema;
}

//
//

export function distinctParser(
  value: any,
  meta: SchemaMeta,
  originalValue: any,
): unknown {
  if (value === null || typeof value !== 'object') {
    return new Issue('not_object', meta, originalValue);
  }

  const prop = meta.distinctProp!;

  if (value[prop] === undefined) {
    return new Issue('not_distinct_prop', meta, originalValue);
  }

  const distincSchema = meta.distinctObjs!.get(value[prop]);

  if (!distincSchema) {
    return new Issue('not_distinct_prop', meta, originalValue);
  }

  return distincSchema.safeParse(originalValue);
}

//
//

export function distinct<
  E extends ObjectSchema<any>,
  T extends Readonly<[...E[]]>,
>(distinctProp: string, schemas: T): Schema<T[number]['_o']> {
  const schema = new Schema<any>([distinctParser]);

  if (__DEV__ && typeof distinctProp !== 'string') {
    throw new Error(
      `The distinctProp must be a string. Received: ${distinctProp}`,
    );
  }

  //
  //  Dev generation values

  if (__DEV__) {
    let jsType = '';

    for (const obj of schemas) {
      //
      if (!(obj instanceof ObjectSchema)) {
        throw new Error(
          `All values of the distinctType must be ObjectSchema. Received: ${obj}`,
        );
      }

      if (!obj.shape.hasOwnProperty(distinctProp)) {
        throw new Error(
          `All values of the distinctType must have the distinctProp '${distinctProp}'. Received: ${obj}`,
        );
      }

      if (!obj.shape[distinctProp].meta.literal) {
        throw new Error(
          `All values of the distinctType must have the distinctProp '${distinctProp}' as literal. Received: ${obj}`,
        );
      }
    }

    const literals = schemas.map((s) => s.shape[distinctProp].meta.literal);

    // Check if all literals are different
    if (new Set(literals).size !== literals.length) {
      throw new Error(
        `All values of the distinctType must have different literals. Received: ${literals}`,
      );
    }

    jsType = schemas.map((s) => `(${s.meta.jsType!})`).join('|');
    setDefaultMeta(schema, jsType, 'TEXT');
  }

  const distinctObjs: Map<string, ObjectSchema<any>> = new Map();

  schemas.forEach((s) => {
    distinctObjs.set(s.shape[distinctProp].meta.literal, s);
  });

  schema.meta.distinctProp = distinctProp;
  schema.meta.distinctObjs = distinctObjs;

  return schema;
}
