export { Schema } from './version2/Schema';

// Parsers and prebuiltin schemas
export { object, strict } from './parsers/object';
export { array } from './parsers/array';
export { enumType as enum } from './parsers/enum';
export { union } from './parsers/union';
export { literal } from './parsers/literal';
export { discriminatedUnion as distinct } from './parsers/discriminatedUnion';

export { string, trimmed } from './parsers/string';
export { int, id } from './parsers/int';
export { float, number } from './parsers/float';
export { boolean } from './parsers/boolean';
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
