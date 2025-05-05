import { Schema, type SafeParseReturn } from '../schemas/Schema';
import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';

//
//

export function validarCNPJ(cnpj: string): boolean {
  if (/[^0-9\-./]/.test(cnpj)) {
    return false;
  }

  // Removendo caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, '');

  // Verificando se o CNPJ possui 14 dígitos
  if (cnpj.length !== 14) {
    return false;
  }

  // Verificando se todos os dígitos são iguais (CNPJ inválido)
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // Calculando o primeiro dígito verificador
  let soma = 0;
  let peso = 2;
  for (let i = 11; i >= 0; i--) {
    soma += parseInt(cnpj.charAt(i)) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;

  // Verificando o primeiro dígito verificador
  if (digito1 !== parseInt(cnpj.charAt(12))) {
    return false;
  }

  // Calculando o segundo dígito verificador
  soma = 0;
  peso = 2;
  for (let i = 12; i >= 0; i--) {
    soma += parseInt(cnpj.charAt(i)) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;

  // Verificando o segundo dígito verificador
  if (digito2 !== parseInt(cnpj.charAt(13))) {
    return false;
  }

  return true;
}

//
//

export function formatCNPJ(cnpj: string): string {
  // Removendo caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, '');

  // Aplicar a formatação do CNPJ: XX.XXX.XXX/XXXX-XX
  return (
    cnpj.slice(0, 2) +
    '.' +
    cnpj.slice(2, 5) +
    '.' +
    cnpj.slice(5, 8) +
    '/' +
    cnpj.slice(8, 12) +
    '-' +
    cnpj.slice(12)
  );
}

//
//

export class CNPJSchema extends Schema<string> {
  internalParse(originalValue: any): SafeParseReturn<string> {
    let value = originalValue;

    // Boilerplate to normalize the value without trimming
    if (value === '') value = null;
    else if (value === undefined) value = null;

    if (value === null) {
      if (this.req) return safeParseError('required', this, originalValue);
      if (this.def) return safeParseSuccess(this.def());
      return safeParseSuccess();
    }

    if (typeof value !== 'string')
      return safeParseError('not_string', this, originalValue);

    if (validarCNPJ(value)) {
      return safeParseSuccess(formatCNPJ(value));
    }

    return safeParseError('not_cpf', this, originalValue);
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

/**
 * CNPJ - Brazilian CNPJ
 *
 * PRECISA ser melhorado usando https://www.npmjs.com/package/br-validations ou
 * https://www.npmjs.com/package/@brasil-interface/utils
 */
export function cnpj() {
  return new CNPJSchema();
}
