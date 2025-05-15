import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';

// Validação de telefone brasileiro (fixo ou celular)
export function validarTelefone(phone: string): boolean {
  const clearPhone = phone.replace(/\D/g, '');
  const sameCharacterRegexp = /^(.)\1*$/;
  if (!(clearPhone.length >= 8 && clearPhone.length <= 11)) {
    return false;
  }
  if (sameCharacterRegexp.test(clearPhone)) {
    return false;
  }
  if (clearPhone.length > 9 && [0, 1].indexOf(clearPhone.indexOf('0')) !== -1) {
    return false;
  }
  const shortNumber =
    clearPhone.length > 9 ? clearPhone.substring(2) : clearPhone;
  if (shortNumber.length === 8) {
    return [2, 3, 4, 5, 7].indexOf(+shortNumber[0]) !== -1;
  }
  return shortNumber[0] === '9';
}

// Formatação de telefone brasileiro
export function formatarTelefone(phone: string): string {
  const clearPhone = phone.replace(/\D/g, '');
  if (clearPhone.length === 11) {
    // Celular com DDD: (99) 99999-9999
    return `(${clearPhone.slice(0, 2)}) ${clearPhone.slice(2, 7)}-${clearPhone.slice(7, 11)}`;
  } else if (clearPhone.length === 10) {
    // Fixo com DDD: (99) 9999-9999
    return `(${clearPhone.slice(0, 2)}) ${clearPhone.slice(2, 6)}-${clearPhone.slice(6, 10)}`;
  } else if (clearPhone.length === 9) {
    // Celular sem DDD: 99999-9999
    return `${clearPhone.slice(0, 5)}-${clearPhone.slice(5, 9)}`;
  } else if (clearPhone.length === 8) {
    // Fixo sem DDD: 9999-9999
    return `${clearPhone.slice(0, 4)}-${clearPhone.slice(4, 8)}`;
  }
  // Retorna o valor limpo se não bater com nenhum formato
  return clearPhone;
}

// Schema para telefone brasileiro
export class TelefoneSchema extends Schema<string> {
  process(p: ParseContext): void {
    if (typeof p.value !== 'string') return p.error('not_string_type');

    if (!validarTelefone(p.value)) {
      return p.error('not_telefone', p.value);
    }

    p.value = formatarTelefone(p.value);
  }
}

/**
 * Telefone - Telefone brasileiro (fixo ou celular)
 */
export function telefone() {
  return new TelefoneSchema();
}
