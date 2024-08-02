import type { SchemaMeta } from '../types';
import { Issue } from '../Issue';
import { Schema } from '../schemas/Schema';

//
//

export function mixinParser(
  value: any,
  meta: SchemaMeta,
  originalValue: any,
): unknown {
  let firstIssue: Issue | undefined;

  for (const mixinSchema of meta.mixin!) {
    value = mixinSchema.safeParse(originalValue);

    if (value instanceof Issue) {
      if (!firstIssue) {
        firstIssue = value;
      }

      continue;
    }

    return value;
  }

  return firstIssue;
}

//
//

/**
 * Mixin or Union or 'Or' type
 */
export function mixin<E extends Schema<any>, T extends Readonly<[...E[]]>>(
  schemas: T,
): Schema<T[number]['_o']> {
  const schema = new Schema<any>([mixinParser]);

  schema.meta.mixin = schemas as any;

  //
  //  Dev generation values

  const array = schemas as any as Schema<any>[];

  if (array.length < 2) {
    throw new Error(
      `You must provide at least 2 values for the mixin. Received: ${array.length}`,
    );
  }

  if (array.some((v) => !(v instanceof Schema))) {
    throw new Error(
      `All values of the mixin must be Schema. Received: ${array}`,
    );
  }

  schema.meta.jsType = array.map((v) => '(' + v.meta.jsType + ')').join(' | ');

  return schema;
}
