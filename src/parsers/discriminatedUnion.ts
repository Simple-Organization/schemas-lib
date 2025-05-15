import type { Schema, ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';
import { ObjectSchema } from './object';
import { jsonPreprocess } from '../preprocess/jsonPreprocess';

//
//

export type Primitive = string | number | bigint | boolean | null | undefined;

//
//

export class DistinctSchema<
  Prop extends string,
  Schemas extends readonly ObjectSchema<any>[],
> extends Schema<Schemas[number]['_o']> {
  declare readonly _o: Schemas[number]['_o'];
  declare readonly isSchema: true;

  readonly discriminator: Prop;
  readonly schemas: Schemas;
  private readonly schemaMap: Map<any, ObjectSchema<any>>;

  //
  //

  constructor(discriminator: Prop, schemas: Schemas) {
    super();
    this.discriminator = discriminator;
    this.schemas = schemas;

    // Build schema map and check for unique literals
    const map = new Map<any, ObjectSchema<any>>();
    for (const schema of schemas) {
      if (!(schema instanceof ObjectSchema)) {
        throw new Error('All schemas must be ObjectSchema');
      }
      const discSchema = schema.shape[discriminator];
      if (!discSchema || !('literal' in discSchema)) {
        throw new Error(
          `Each schema must have the discriminator property "${discriminator}" as a literal`,
        );
      }
      const literal = (discSchema as any).literal;
      if (map.has(literal)) {
        throw new Error(
          `Duplicate literal value "${literal}" for discriminator "${discriminator}"`,
        );
      }
      map.set(literal, schema);
    }
    this.schemaMap = map;
  }

  //
  //

  process(p: ParseContext): void {
    if (typeof p.value !== 'object' || p.value === null) {
      return p.error('not_object');
    }

    const discValue = p.value[this.discriminator];
    if (discValue === undefined) {
      return p.error('missing_discriminator', this.discriminator);
    }

    const schema = this.schemaMap.get(discValue);
    if (!schema) {
      return p.error('invalid_discriminator', discValue);
    }

    schema.preprocess(p);

    if (p.hasError) {
      return;
    }

    schema.process(p);
  }
}

DistinctSchema.prototype.preprocess = jsonPreprocess;

//
//

type InferSchemaType<T> = T extends Schema<infer U> ? U : never;

export function discriminatedUnion<
  Schemas extends readonly Schema<any>[],
  Discriminator extends string,
>(
  discriminator: Discriminator,
  schemas: Schemas,
): Schema<InferSchemaType<Schemas[number]>> {
  return new DistinctSchema(discriminator, schemas as any);
}
