import { email_regex, integer_regex, ipv4_regex } from './zodRegexes';
import { RegexSchema } from './RegexSchema';

/** A string with a regex */
export function regex(regex: RegExp, msg: string) {
  return new RegexSchema(regex, msg);
}

/** ipv4 */
export function ipv4() {
  return new RegexSchema(ipv4_regex, 'O campo não é um ipv4');
}

/** email */
export function email() {
  return new RegexSchema(email_regex, 'O campo não é um email válido');
}

/** intString */
export function intString() {
  return new RegexSchema(
    integer_regex,
    'O campo não é um texto de número inteiro',
  );
}
