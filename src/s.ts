// Parsers and prebuiltin schemas
export { object, strict } from './parsers/object';

export { string, trimmed } from './parsers/string';
export { int, id } from './parsers/int';
export { any } from './parsers/any';
export { array } from './parsers/array';
export { boolean } from './parsers/boolean';
export { enumType as enum } from './parsers/enum';
export { union } from './parsers/union';
export { literal } from './parsers/literal';
export { file } from './parsers/file';
export { discriminatedUnion } from './parsers/discriminatedUnion';
export { record } from './parsers/record';

export { float, number, dinheiro } from './parsers/float';
export { datetimeUTC } from './parsers/datetimeUTC';

// Regex schemas
export * from './regexes/regex';
export { url } from './regexes/url';
export { cnpj } from './regexes/cnpj';
export { cpf } from './regexes/cpf';
export { rg } from './regexes/rg';
export { date } from './regexes/date';
export { month } from './regexes/month';
export { telefone } from './regexes/telefone';
export { nome } from './regexes/nome';
export { textarea } from './regexes/textarea';

// infer
export { type InferSchema as infer } from './version2/types';
