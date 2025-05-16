import { email_regex, integer_regex, ipv4_regex } from './zodRegexes';
import { RegexSchema, TrimRegexSchema } from './RegexSchema';

/** A string with a regex */
export function regex(regex: RegExp, msg: string) {
  return new TrimRegexSchema(regex, msg);
}

/** ipv4 */
export function ipv4() {
  return new TrimRegexSchema(ipv4_regex, 'O campo não é um ipv4');
}

/** email */
export function email() {
  return new TrimRegexSchema(email_regex, 'O campo não é um email válido');
}

/** intString */
export function intString() {
  return new TrimRegexSchema(
    integer_regex,
    'O campo não é um texto de número inteiro',
  );
}
