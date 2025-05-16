import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';

//
// Schema para campo de nome
export class TextArea extends Schema<string> {
  process(p: ParseContext): void {
    if (typeof p.value !== 'string') return p.error('not_string_type');

    p.value = p.value.replace(/\r\n/g, '\n');
  }
}

/**
 * Nome - Campo de nome (mínimo 2 letras, pode conter letras acentuadas, números e espaços)
 */
export function textarea() {
  return new TextArea();
}
