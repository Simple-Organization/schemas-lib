import type { MinMaxSchema, ParseContext } from './types';

//
//

export type ErrorMessageCode =
  | 'required'
  | 'not_number_type'
  | 'not_integer'
  | 'min_number'
  | 'max_number'
  | 'nan'
  | 'not_valid_json'
  | 'not_object'
  | 'object_extra_keys'
  | 'not_finite'
  | 'not_string_type'
  | 'not_literal_equal'
  | 'not_enum'
  | 'boolean_type'
  | 'not_array'
  | 'invalid_array_element'
  | 'union_no_match'
  | 'not_datetime_type'
  | 'min_datetime'
  | 'max_datetime'
  | 'missing_discriminator'
  | 'invalid_discriminator'
  | 'not_cpf'
  | 'not_cnpj'
  | 'not_date'
  | 'not_month'
  | 'not_url'
  | 'not_rg'
  | 'not_telefone'
  | 'not_email'
  | 'not_regex'
  | 'not_name'
  | 'not_a_file';

//
//

export function getErrorMessage(
  code: ErrorMessageCode,
  c: ParseContext,
  addon?: any,
): string {
  switch (code) {
    case 'required':
      return 'O campo é obrigatório';
    case 'not_number_type':
      return 'O campo não é um número';
    case 'not_integer':
      return 'O campo não é um número inteiro';
    case 'min_number':
      return `O campo é menor que o mínimo ${(c.schema as MinMaxSchema).vMin}`;
    case 'max_number':
      return `O campo é maior que o máximo ${(c.schema as MinMaxSchema).vMax}`;
    case 'nan':
      return 'O campo não é um número válido';
    case 'not_valid_json':
      return 'O campo não é um JSON válido';
    case 'not_object':
      return 'O campo não é um objeto';
    case 'object_extra_keys':
      return `O campo tem chaves extras '${addon}'`;
    case 'not_finite':
      return 'O campo não é um número finito';
    case 'not_string_type':
      return 'O campo não é uma string';
    case 'not_literal_equal':
      return `O campo não é igual a ${addon}`;
    case 'not_enum':
      return `O campo não é um dos valores permitidos '${addon}'`;
    case 'boolean_type':
      return 'O campo não é um booleano';
    case 'not_array':
      return 'O campo não é um array';
    case 'invalid_array_element':
      return 'O campo não é um array válido';
    case 'union_no_match':
      return 'O campo não é um dos tipos permitidos';
    case 'not_datetime_type':
      return 'O campo não é uma data válida';
    case 'min_datetime':
      return `O campo é menor que a data mínima ${addon}`;
    case 'max_datetime':
      return `O campo é maior que a data máxima ${addon}`;
    case 'missing_discriminator':
      return `O campo não possui o discriminador '${addon}'`;
    case 'invalid_discriminator':
      return `O campo possui um discriminador inválido '${addon}'`;
    case 'not_cpf':
      return 'O campo não é um CPF válido';
    case 'not_cnpj':
      return 'O campo não é um CNPJ válido';
    case 'not_date':
      return 'O campo não é uma data válida';
    case 'not_month':
      return 'O campo não é um mês válido';
    case 'not_url':
      return 'O campo não é uma URL válida';
    case 'not_rg':
      return 'O campo não é um RG válido';
    case 'not_telefone':
      return 'O campo não é um telefone válido';
    case 'not_email':
      return 'O campo não é um e-mail válido';
    case 'not_regex':
      return addon ? addon : 'O campo não corresponde à expressão regular';
    case 'not_name':
      return 'O campo não é um nome válido';
    case 'not_a_file':
      return 'O campo não é um arquivo';
    default:
      console.log('Erro desconhecido', code);
      return 'Erro desconhecido';
  }
}
