import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { Schema } from '../version2/Schema';
import type { ParseContext, SafeParseReturn } from '../version2/types';

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

export function formatarRG(rg: string): string {
  // Removendo caracteres não numéricos
  rg = rg.replace(/\D/g, '');

  // Formatando o RG
  const parte1 = rg.slice(0, 2);
  const parte2 = rg.slice(2, 5);
  const parte3 = rg.slice(5, 8);
  const digitoVerificador = rg.slice(8);

  return `${parte1}.${parte2}.${parte3}-${digitoVerificador}`;
}

//
//

export class RGSchema extends Schema<string> {
  process(c: ParseContext): void {
    throw new Error('Method not implemented.');
  }
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
      return safeParseSuccess(formatarRG(value));
    }

    return safeParseError('not_rg', this, originalValue);
  }
}

/**
 * RG - Brazilian RG
 *
 * PRECISA ser melhorado usando https://www.npmjs.com/package/br-validations ou
 * https://www.npmjs.com/package/@brasil-interface/utils ou
 * https://www.npmjs.com/package/br-validations
 */
export function rg() {
  return new RGSchema();
}
