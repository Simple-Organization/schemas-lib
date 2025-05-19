// Parsers and prebuiltin schemas
export * as s from './s';

// Errors
export { SchemaLibError } from './SchemaLibError';

// Utils
export { getParsedType } from './utils/getParsedType';
export { getSchemaByPath } from './utils/getSchemaByPath';
export { flatten, unflatten, flattenStr } from './utils/flatten';

// Default
export type {
  InferSchema,
  SafeParseReturn,
  Issue,
  ParseContext,
  MinMaxSchema,
} from './version2/types';

export { Schema } from './version2/Schema';
// export { ArraySchema } from './parsers/array';
// export { NumberSchema } from './parsers/float';
// export { ObjectSchema } from './parsers/object';
// export { StringSchema } from './parsers/string';
// export { NomeSchema } from './regexes/nameField';
// export { RegexSchema } from './regexes/RegexSchema';
// export { URLSchema } from './regexes/url';
