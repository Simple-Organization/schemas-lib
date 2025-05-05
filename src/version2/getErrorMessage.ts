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
  | 'nan';

//
//

export function getErrorMessage(
  code: ErrorMessageCode,
  c: ParseContext,
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
  }
}
