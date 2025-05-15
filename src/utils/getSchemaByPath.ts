import type { Schema } from '../version2/Schema';
import { ArraySchema } from '../parsers/array';
import { ObjectSchema } from '../parsers/object';

//
//

export function getSchemaByPath(
  path: string,
  schema: Schema<any>,
): Schema<any> | undefined {
  const parts = path.split('.');
  let current: Schema<any> = schema;

  for (const part of parts) {
    if (current instanceof ObjectSchema) {
      const shape = current.shape;
      current = shape[part];
      if (!current) return undefined;
    } else if (current instanceof ArraySchema) {
      current = current.element;
    } else {
      return undefined; // path inválido
    }
  }

  return current;
}
