import { Schema, type SafeParseReturn } from '../schemas/Schema';
import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';

//
//

export function validarRG(rg: string): boolean {
  if (/[^0-9\-.]/.test(rg)) {
    return false;
  }

  // Removendo caracteres não numéricos
  rg = rg.replace(/\D/g, '');

  // Verificando se o RG possui pelo menos 4 dígitos
  if (rg.length < 4) {
    return false;
  }

  // Verificando se todos os dígitos são iguais (RG inválido)
  if (/^(\d)\1+$/.test(rg)) {
    return false;
  }

  return true;
}

//
//

export function formatarRG(cpf: string): string {
  const parte1 = cpf.slice(0, 3);
  const parte2 = cpf.slice(3, 6);
  const parte3 = cpf.slice(6, 9);
  const parte4 = cpf.slice(9, 11);

  return `${parte1}.${parte2}.${parte3}-${parte4}`;
}

//
//

export class RGSchema extends Schema<string> {
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

    if (validarRG(value)) {
      return safeParseSuccess(formatarRG(value.replace(/\D/g, '')));
    }

    return safeParseError('not_rg', this, originalValue);
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

/**
 * RG - Brazilian RG
 */
export function rg() {
  return new RGSchema();
}
