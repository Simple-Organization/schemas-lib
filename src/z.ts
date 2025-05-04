// Parsers and prebuiltin schemas
export { object, strict } from './parsers/object';
export { array } from './parsers/array';
export { enumType } from './parsers/enumType';
export { union } from './parsers/union';
export { distinct, literal } from './parsers/distinct';

export { string, trimmed } from './parsers/string';
export { int } from './parsers/int';
export { float, number } from './parsers/float';
export { boolean } from './parsers/boolean';
export { datetimeUTC } from './parsers/datetimeUTC';
