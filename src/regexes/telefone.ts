import { Schema, type SafeParseReturn } from '../schemas/Schema';
import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';

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
  internalParse(originalValue: any): SafeParseReturn<string> {
    let value = originalValue;

    // Normalização sem trim
    if (value === '') value = null;
    else if (value === undefined) value = null;

    if (value === null) {
      if (this.req) return safeParseError('required', this, originalValue);
      if (this.def) return safeParseSuccess(this.def());
      return safeParseSuccess();
    }

    if (typeof value !== 'string')
      return safeParseError('not_string', this, originalValue);

    if (validarTelefone(value)) {
      return safeParseSuccess(formatarTelefone(value));
    }

    return safeParseError('not_phone', this, originalValue);
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

/**
 * Telefone - Telefone brasileiro (fixo ou celular)
 */
export function telefone() {
  return new TelefoneSchema();
}
