import type { ErrorMessageCode } from './getErrorMessage';
import type { SchemaLibError } from '../SchemaLibError';
import type { Schema } from './Schema';

export type MinMaxSchema = {
  vMin?: number;
  vMax?: number;
};

export type Issue = {
  code: ErrorMessageCode;
  message: string;
  value: any;
  original: any;
  path: PropertyKey[];
};

/**
 * Array mutável passado por todos schema.process
 */
export type ParseContext = {
  /** Valor processado no momento */
  value: any;
  /** Valor enviado no inicio */
  original: any;
  /** Se o schema.process teve erro no processamento atual */
  hasError: boolean;
  /** Lista de erros que já aconteceram no schema.process */
  issues: Issue[];
  /** O Schema que está processando no momento */
  schema: Schema<any>;
  /** Array mutável usada para definir a posição do erro de validação */
  path: PropertyKey[];
  /** Define um erro atual */
  error(code: ErrorMessageCode, addon?: any): void;
  /** The value to use when the value is empty */
  empty: '' | null | undefined;
};

//
//

export type SafeParseReturn<T> =
  | SafeParseReturnSuccess<T>
  | SafeParseReturnError;

export type SafeParseReturnSuccess<T> = {
  success: true;
  data: T;
};

export type SafeParseReturnError = {
  success: false;
  error: SchemaLibError;
};

//
//

export type InferSchema<T extends Schema<any>> = T['_o'];
