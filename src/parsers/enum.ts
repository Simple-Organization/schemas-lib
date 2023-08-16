import type { SchemaMeta } from '../types';
import { Issue } from '../Issue';
import { Schema } from '../schemas/Schema';
import { setDefaultMeta } from '../utils/utils';

//
//

export function enumParser(
  value: any,
  meta: SchemaMeta,
  originalValue: any,
): Issue | string {
  if (typeof value !== 'string') {
    return new Issue('not_string_type', meta, originalValue);
  }

  if (!meta.enum?.includes(value)) {
    return new Issue('not_enum', meta, originalValue);
  }

  return value;
}

//
//

export function enumType<
  E extends string | number,
  T extends Readonly<[...E[]]>,
>(values: T): Schema<T[number]> {
  const schema = new Schema<any>([enumParser]);

  schema.meta.enum = values as any;

  //
  //  Dev generation values

  if (__DEV__) {
    let jsType = 'string';

    const array = values as any as string[];

    if (array.length < 2) {
      throw new Error(
        `You must provide at least 2 values for the enumType. Received: ${array.length}`,
      );
    }

    if (array.some((v) => typeof v !== 'string' && typeof v !== 'number')) {
      throw new Error(
        `All values of the enumType must be strings or numbers. Received: ${array}`,
      );
    }

    jsType = array.map((v) => "'" + v + "'").join('|');
    setDefaultMeta(schema, jsType, 'TEXT');
  }

  return schema;
}
