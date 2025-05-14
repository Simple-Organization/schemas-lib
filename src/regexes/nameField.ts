import type { ParseContext, SafeParseReturn } from '../version2/types';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { Schema } from '../version2/Schema';

// Regex para nomes: pelo menos 2 letras, pode conter letras acentuadas, números e espaços após as duas primeiras letras
const regex = /^[a-zA-Z\u00C0-\u00FF]{2}[a-zA-Z\u00C0-\u00FF0-9 ]*$/;

// Validação de campo de nome
export function validarNome(nome: string): boolean {
  if (typeof nome !== 'string') return false;
  // Remove espaços extras para validação
  const nomeTrim = nome.trim();
  return regex.test(nomeTrim);
}

// Schema para campo de nome
export class NomeSchema extends Schema<string> {
  process(c: ParseContext): void {
    throw new Error('Method not implemented.');
  }
  internalParse(originalValue: any): SafeParseReturn<string> {
    let value = originalValue;

    // Boilerplate to normalize the value with trimming
    if (typeof value === 'string') {
      value = value.trim();
      if (value === '') value = null;
    } else if (value === undefined) value = null;

    if (value === null) {
      if (this.req) return safeParseError('required', this, originalValue);
      if (this.def) return safeParseSuccess(this.def());
      return safeParseSuccess();
    }

    if (typeof value !== 'string')
      return safeParseError('not_string', this, originalValue);

    if (/^[a-zA-Z\u00C0-\u00FF]{2}[a-zA-Z\u00C0-\u00FF0-9 ]*$/.test(value)) {
      return safeParseSuccess(value);
    }

    return safeParseError('not_name', this, originalValue);
  }
}

/**
 * Nome - Campo de nome (mínimo 2 letras, pode conter letras acentuadas, números e espaços)
 */
export function nome() {
  return new NomeSchema();
}
