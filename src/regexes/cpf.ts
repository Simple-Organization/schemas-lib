import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';
import { trimPreprocess } from '../preprocess/trimPreprocess';

//
//

export function validarCPF(cpf: string): boolean {
  if (/[^0-9\-.]/.test(cpf)) {
    return false;
  }

  // Removendo caracteres não numéricos
  cpf = cpf.replace(/[-\.]/g, '');

  // Verificando se o CPF possui 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Verificando se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Calculando o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto < 10 ? resto : 0;

  // Verificando o primeiro dígito verificador
  if (digito1 !== parseInt(cpf.charAt(9))) {
    return false;
  }

  // Calculando o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto < 10 ? resto : 0;

  // Verificando o segundo dígito verificador
  if (digito2 !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

//
//

export function formatarCPF(cpf: string): string {
  // Removendo caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  const parte1 = cpf.slice(0, 3);
  const parte2 = cpf.slice(3, 6);
  const parte3 = cpf.slice(6, 9);
  const parte4 = cpf.slice(9, 11);

  return `${parte1}.${parte2}.${parte3}-${parte4}`;
}

//
//

export class CPFSchema extends Schema<string> {
  process(p: ParseContext): void {
    if (typeof p.value !== 'string') return p.error('not_string_type');

    if (!validarCPF(p.value)) {
      return p.error('not_cpf', p.value);
    }

    p.value = formatarCPF(p.value);
  }
}

CPFSchema.prototype.preprocess = trimPreprocess;

/**
 * CPF - Brazilian CPF
 *
 * PRECISA ser melhorado usando https://www.npmjs.com/package/br-validations ou
 * https://www.npmjs.com/package/@brasil-interface/utils ou
 * https://www.npmjs.com/package/br-validations
 */
export function cpf() {
  return new CPFSchema();
}
