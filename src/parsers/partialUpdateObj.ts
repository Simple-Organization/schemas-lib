import type { SchemaMeta } from '../types';
import { Schema } from '../schemas/Schema';
import { ObjectSchema, ObjectSchemaRecord } from '../schemas/ObjectSchema';
import { strict } from './object';

//
//

type PartialUpdateOptional<T extends ObjectSchemaRecord> = {
  [k in keyof T]: Schema<T[k]['_o'] | undefined>;
};

/**
 * Cria um objeto a partir de dois shapes, um aonde todas as chaves são obrigatórias
 *
 * e outro aonde todas as chaves são opcionais
 *
 * Converte as chaves required para opcionais, e mantém as chaves opcionais como opcionais
 *
 * nullable são convertidos para nullsih
 *
 * @param requiredShape Shape aonde todas as chaves devem ser obrigatórias
 * @param partialShape Shape aonde todas as chaves são modificadas para opcionais
 * @returns Object `strict` com todas as chaves obrigatórias e opcionais
 */
export function partialUpdateObj<
  T extends ObjectSchemaRecord,
  E extends ObjectSchemaRecord,
>(
  requiredShape: T,
  partialShape: E,
): ObjectSchema<T & PartialUpdateOptional<E>> {
  //
  // Pega as keys parciais
  // para o uso na validação em desenvolvimento, e para conversão para opcionais

  const partialKeys = Object.keys(partialShape);

  //
  // Validação do requiredShape e partialShape

  if (__DEV__) {
    if (requiredShape === null || typeof requiredShape !== 'object') {
      throw new Error(`The requiredShape must be an object`);
    }

    if (partialShape === null || typeof partialShape !== 'object') {
      throw new Error(`The partialShape must be an object`);
    }

    const requiredKeys = Object.keys(requiredShape);

    for (const key of requiredKeys) {
      const requiredSchema = requiredShape[key];

      if (partialKeys.includes(key)) {
        throw new Error(
          `The requiredShape and partialShape must not have the same keys. Received: ${key}`,
        );
      }

      if (!(requiredSchema instanceof Schema)) {
        throw new Error(
          `Expected value['${key}'] to be a instance of Schema, but received: ${requiredSchema}`,
        );
      }

      const mode = requiredSchema.meta.mode;
      if (mode !== undefined && mode !== 'required') {
        throw new Error(
          `The required shape must have required fields. Received: ${key}`,
        );
      }
    }

    for (const key of partialKeys) {
      const partialSchema = partialShape[key];

      if (!(partialSchema instanceof Schema)) {
        throw new Error(
          `Expected value['${key}'] to be a instance of Schema, but received: ${partialSchema}`,
        );
      }
    }
  }

  //
  //

  const _shape = { ...requiredShape } as ObjectSchemaRecord;

  //
  //

  let schema: Schema<any>;
  let mode: SchemaMeta['mode'];

  //
  //

  for (const key of partialKeys) {
    schema = partialShape[key];
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
