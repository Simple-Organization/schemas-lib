import { falseOptions, trueOptions } from './parsers/boolean';
import type { ObjectMeta } from './schemas/ObjectSchema';
import { type SchemaMeta } from './types';
import { getParsedType } from './utils/utils';

//
//

export const validationErrors: Record<
  string,
  string | ((originalValue: any, meta: SchemaMeta) => string)
> = {
  //
  //  Required, Optional and nullable

  required: 'O campo é obrigatório',
  not_nullable: 'O campo não pode ser nulo',
  not_optional: 'O campo não pode ser undefined',

  //
  //  int

  not_integer: 'O campo não é um número inteiro',

  //
  //  number

  not_finite: 'O campo é infinito, ele precisa ser um número finito',
  not_number_string: `O campo  é uma string, mas não é um texto de número`,
  not_number_type: expectedType('number'),
  nan: 'O campo deve ser um número diferente de NaN',
  min_number: (originalValue: number, meta: SchemaMeta) =>
    `O campo é menor ${meta.min}`,
  max_number: (originalValue: number, meta: SchemaMeta) =>
    `O campo é maior ${meta.max}`,

  //
  //  string

  not_string_type: expectedType('string'),
  min_length: (originalValue: string, meta: SchemaMeta) =>
    `O campo tem menos caracteres que o mínimo ${meta.min}`,
  max_length: (originalValue: string, meta: SchemaMeta) =>
    `O campo tem mais caracteres que o máximo ${meta.max}`,
  not_includes: (originalValue: string, meta: SchemaMeta) =>
    `O campo não contém o texto ${meta.includes}`,

  //
  //  boolean

  boolean_type: () =>
    `'O campo deve ser um booleano entre [${trueOptions.join(
      ',',
    )}] ou [${falseOptions.join(',')}]`,

  //
  //  enum

  not_enum: (originalValue: any, meta: SchemaMeta) =>
    `O campo não é um dos valores do enum ${meta.enum}`,

  //
  //  datetime

  not_utc_datetime_string: 'O campo é uma string, mas não é de datetime UTC',
  not_datetime_type: expectedType('number|string|Date'),
  min_datetime: (originalValue: Date, meta: SchemaMeta) =>
    `O campo é menor ${meta.min}`,
  max_datetime: (originalValue: Date, meta: SchemaMeta) =>
    `O campo é maior ${meta.max}`,

  //
  //  object

  not_valid_json: 'O campo não é um JSON válido',
  not_object: expectedType('object'),
  object_shape: 'Pelo menos um dos campos do objeto não tem o formato esperado',
  object_extra_keys(originalValue: Record<string, any>, meta: ObjectMeta) {
    const shapeKeys = Object.keys(meta.shape!);
    const valueKeys = Object.keys(originalValue);

    const extraKeys = valueKeys.filter((key) => !shapeKeys.includes(key));

    return "O objeto tem chaves extras: '" + extraKeys.join("', '" + "'");
  },

  //
  //  array

  not_array: expectedType('array'),
  array_shape:
    'Pelo menos um dos elementos da array não tem o formato esperado',
  min_array_length: (originalValue: any[], meta: SchemaMeta) =>
    `O campo tem menos elementos que o mínimo ${meta.min}`,
  max_array_length: (originalValue: any[], meta: SchemaMeta) =>
    `O campo tem mais elementos que o máximo ${meta.max}`,

  //
  //  literal
  not_literal_equal: (originalValue: any, meta: SchemaMeta) =>
    `O campo não é igual ao valor literal ${meta.literal}`,

  //
  //  distinct
  not_distinct_prop: (originalValue: any, meta: SchemaMeta) =>
    `O campo não possui a propriedade '${meta.distinctProp}' ou ela não é válida`,

  //
  //  prebuilt

  not_url: `O campo não é uma URL válida`,
  not_namefield: `O campo não é um nome válido. Deve conter apenas letras, espaços e hífens`,
  not_date: `O campo não é uma data válida`,
  not_email: `O campo não é um email válido`,
  not_cpf_cnpj: `O campo não é um CPF ou CNPJ válido`,
  not_cpf: `O campo não é um CPF válido`,
  not_cnpj: `O campo não é um CNPJ válido`,
};

//
//

function expectedType(expected: string) {
  return (originalValue: any) =>
    `Esperava um tipo '${expected}' recebeu '${getParsedType(originalValue)}'`;
}
