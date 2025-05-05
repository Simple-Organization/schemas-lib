import type { ErrorMessageCode } from './getErrorMessage';
import type { ISchema } from '../schemas/Schema';

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
  error(code: ErrorMessageCode): void;
};

export interface Issue {
  readonly code: string;
  readonly value: unknown;
  readonly original: unknown;
  readonly path: PropertyKey[];
  readonly message: string;
}
