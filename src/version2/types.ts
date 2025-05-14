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
  schema: ISchema<any>;
  /** Array mutável usada para definir a posição do erro de validação */
  path: PropertyKey[];
  /** Define um erro atual */
  error(code: ErrorMessageCode, addon?: any): void;
};

//
//

export type SafeParseReturn<T> = {
  success: boolean;
  data?: T;
  error?: SchemaLibError;
};

//
//

export type ISchema<T> = {
  readonly _o?: T;
  readonly isSchema: true;
  parse: (originalValue: any) => T;
  safeParse: (originalValue: any) => SafeParseReturn<T>;
  default: (defaultSetter: (() => T) | T) => ISchema<T>;
  optional: () => ISchema<Exclude<T, null> | null | undefined>;
  req: boolean;
  def?: () => T;
};

//
//

export type Infer<T extends Schema<any>> = T['_o'];
