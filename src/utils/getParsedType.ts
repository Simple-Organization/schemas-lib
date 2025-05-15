//
//

export const parsedType = [
  'string',
  'nan',
  'number',
  'integer',
  'float',
  'boolean',
  'date',
  'bigint',
  'symbol',
  'function',
  'undefined',
  'null',
  'array',
  'object',
  'unknown',
  'promise',
  'void',
  'never',
  'map',
  'set',
] as const;

//
//

/**
 * Function adapted from Zod
 *
 * all rights for the Zod contributors
 */
export function getParsedType(data: any): (typeof parsedType)[number] {
  const t = typeof data;

  switch (t) {
    case 'undefined':
      return 'undefined';

    case 'string':
      return 'string';

    case 'number':
      return isNaN(data) ? 'nan' : 'number';

    case 'boolean':
      return 'boolean';

    case 'function':
      return 'function';

    case 'bigint':
      return 'bigint';

    case 'symbol':
      return 'symbol';

    case 'object':
      if (Array.isArray(data)) {
        return 'array';
      }

      if (data === null) {
        return 'null';
      }

      if (
        data.then &&
        typeof data.then === 'function' &&
        data.catch &&
        typeof data.catch === 'function'
      ) {
        return 'promise';
      }

      if (typeof Map !== 'undefined' && data instanceof Map) {
        return 'map';
      }
      if (typeof Set !== 'undefined' && data instanceof Set) {
        return 'set';
      }
      if (typeof Date !== 'undefined' && data instanceof Date) {
        return 'date';
      }

      return 'object';

    default:
      return 'unknown';
  }
}
