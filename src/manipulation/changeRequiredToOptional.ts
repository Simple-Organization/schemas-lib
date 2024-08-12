import type { ObjectSchema, ObjectSchemaRecord } from '../schemas/ObjectSchema';
import type { SchemaMeta } from '../types';
import type { PartialUpdateOptional } from './partialUpdateObj';
import { strict } from '../parsers/object';
import { Schema } from '../schemas/Schema';

/**
 * Converte propriedades required para optional e nullable para nullish
 *
 * @param shape Shape aonde todas as propriedade serão convertidas para optional ou nullish
 * @returns Object `strict` com todas as propriedades required convertidas para optional ou nullish
 */
export function changeRequiredToOptional<T extends ObjectSchemaRecord>(
  shape: T,
): ObjectSchema<PartialUpdateOptional<T>> {
  //
  // Pega as keys parciais
  // para o uso na validação em desenvolvimento, e para conversão para opcionais

  const keys = Object.keys(shape);

  //
  // Validação do shape

  if (shape === null || typeof shape !== 'object') {
    throw new Error(`The shape must be an object`);
  }

  for (const key of keys) {
    const schema = shape[key];

    if (!(schema instanceof Schema)) {
      throw new Error(
        `Expected value['${key}'] to be a instance of Schema, but received: ${schema}`,
      );
    }
  }

  //
  //

  const _shape = { ...shape } as ObjectSchemaRecord;

  //
  //

  let schema: Schema<any>;
  let mode: SchemaMeta['mode'];

  //
  //

  for (const key of keys) {
    schema = _shape[key];
    mode = schema.meta.mode;

    if (mode === 'required' || mode === undefined) {
      schema = schema.optional();
    } else if (mode === 'nullable') {
      schema = schema.nullish();
    }

    _shape[key] = schema;
  }

  //
  //

  return strict(_shape) as any;
}
