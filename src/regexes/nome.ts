import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';

//
// Schema para campo de nome
export class NomeSchema extends Schema<string> {
  process(p: ParseContext): void {
    if (typeof p.value !== 'string') return p.error('not_string_type');

    if (!/^[a-zA-Z\u00C0-\u00FF]{2}[a-zA-Z\u00C0-\u00FF0-9 ]*$/.test(p.value)) {
      return p.error('not_name', p.value);
    }
  }
}

/**
 * Nome - Campo de nome (mínimo 2 letras, pode conter letras acentuadas, números e espaços)
 */
export function nome() {
  return new NomeSchema();
}
