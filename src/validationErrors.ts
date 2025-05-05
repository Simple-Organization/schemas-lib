import type { ISchema } from './schemas/Schema';
import type { EnumSchema } from './parsers/enum';
import type { LiteralSchema } from './parsers/literal';
import { falseOptions, trueOptions } from './parsers/boolean';
import { MinMaxSchema } from './schemas/MinMaxSchema';
import { getParsedType } from './utils/utils';

//
//

export type ValidationErrorRecord = Record<
  string,
  string | ((originalValue: any, schema: ISchema<any>) => string)
>;

//
//

export const validationErrors: ValidationErrorRecord = {
  //
  //  Required, Optional

  required: 'O campo é obrigatório',
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
  min_number: (originalValue: number, schema: ISchema<number>) =>
    `O campo é menor ${(schema as MinMaxSchema<number>).vMin}`,
  max_number: (originalValue: number, schema: ISchema<number>) =>
    `O campo é maior ${(schema as MinMaxSchema<number>).vMax}`,

  //
  //  string

  not_string_type: expectedType('string'),
  min_length: (originalValue: string, schema: ISchema<string>) =>
    `O campo tem menos caracteres que o mínimo ${(schema as MinMaxSchema<string>).vMin}`,
  max_length: (originalValue: string, schema: ISchema<string>) =>
    `O campo tem mais caracteres que o máximo ${(schema as MinMaxSchema<string>).vMax}`,

  not_includes: (originalValue: string, schema: ISchema<string>) =>
    `O campo não contém o texto ${(schema as EnumSchema).enum}`,

  //
  //  boolean

  boolean_type: () =>
    `'O campo deve ser um booleano entre [${trueOptions.join(
      ',',
    )}] ou [${falseOptions.join(',')}]`,

  //
  //  enum

  not_enum: (originalValue: any, schema: ISchema<string>) =>
    `O campo não é um dos valores do enum ${(schema as EnumSchema).enum}`,

  //
  //  datetime

  not_utc_datetime_string: 'O campo é uma string, mas não é de datetime UTC',
  not_datetime_type: expectedType('number|string|Date'),
  min_datetime: (originalValue: Date, meta: ISchema<string>) =>
    `O campo é menor ${meta.min}`,
  max_datetime: (originalValue: Date, meta: ISchema<string>) =>
    `O campo é maior ${meta.max}`,

  //
  //  object

  not_valid_json: 'O campo não é um JSON válido',
  not_object: expectedType('object'),
  object_shape: 'Pelo menos um dos campos do objeto não tem o formato esperado',
  object_extra_keys(originalValue: Record<string, any>, meta: ISchema<string>) {
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
  min_array_length: (originalValue: any[], schema: ISchema<any[]>) =>
    `O campo tem menos elementos que o mínimo ${(schema as MinMaxSchema<any[]>).vMin}`,
  max_array_length: (originalValue: any[], schema: ISchema<any[]>) =>
    `O campo tem mais elementos que o máximo ${(schema as MinMaxSchema<any[]>).vMax}`,

  //
  //  literal
  not_literal_equal: (originalValue: any, schema: ISchema<any>) =>
    `O campo não é igual ao valor literal ${(schema as LiteralSchema<any>).literal}`,

  //
  //  distinct
  not_distinct_prop: (originalValue: any, meta: ISchema<string>) =>
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

  invalid_object_value: 'Erro temporário, não é possível validar o objeto',
  invalid_array_element: 'Erro temporário, não é possível validar o array',
  union_no_match:
    'Erro temporário, não é possível validar o union, nenhum dos schemas bateu',
  invalid_discriminator:
    'Erro temporário, não é possível validar o discriminador',
  missing_discriminator:
    'Erro temporário, não é possível validar o discriminador, ele não foi encontrado',
  not_string:
    'Erro temporário, não é possível validar o discriminador, ele não é uma string',
  not_regex: `O campo não é uma string válida para regex`,
  not_month: `O campo não é uma string válida para mês`,
  not_rg: `O campo não é uma string válida para RG`,
  object_invalid: `O campo não é um objeto válido`,
};

//
//

function expectedType(expected: string) {
  return (originalValue: any) =>
    `Esperava um tipo '${expected}' recebeu '${getParsedType(originalValue)}'`;
}
