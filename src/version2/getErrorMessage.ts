import type { MinMaxSchema } from '../schemas/MinMaxSchema';
import type { ParseContext } from './types';

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
  | 'object_invalid'; // Temporary, to be removed later

//
//

export function getErrorMessage(
  code: ErrorMessageCode,
  c: ParseContext,
  addon?: any,
): string | void {
  switch (code) {
    case 'required':
      return 'O campo é obrigatório';
    case 'not_number_type':
      return 'O campo não é um número';
    case 'not_integer':
      return 'O campo não é um número inteiro';
    case 'min_number':
      return `O campo é menor que o mínimo ${(c.schema as MinMaxSchema<number>).vMin}`;
    case 'max_number':
      return `O campo é maior que o máximo ${(c.schema as MinMaxSchema<number>).vMax}`;
    case 'nan':
      return 'O campo não é um número válido';
    case 'not_valid_json':
      return 'O campo não é um JSON válido';
    case 'not_object':
      return 'O campo não é um objeto';
    case 'object_extra_keys':
      return `O campo tem chaves extras: ${addon}`;
  }
}
