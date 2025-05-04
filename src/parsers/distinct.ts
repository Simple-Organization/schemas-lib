import type { ValidationErrorRecord } from '../validationErrors';
import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import {
  NewSchema,
  type ISchema,
  type SafeParseReturn,
} from '../schemas/NewSchema';
import { ObjectSchema } from './object';

//
//

export type Primitive = string | number | bigint | boolean | null | undefined;

//
//

export class DistinctSchema<
  Prop extends string,
  Schemas extends readonly ObjectSchema<any>[],
> extends NewSchema<Schemas[number]['_o']> {
  declare readonly _o: Schemas[number]['_o'];
  declare readonly isSchema: true;

  readonly discriminator: Prop;
  readonly schemas: Schemas;
  private readonly schemaMap: Map<any, ObjectSchema<any>>;

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

  internalParse(originalValue: any): SafeParseReturn<Schemas[number]['_o']> {
    let value = originalValue;

    if (typeof value === 'string') {
      if (value === '') {
        value = null;
      } else {
        try {
          value = JSON.parse(value);
        } catch {
          return safeParseError('not_valid_json', this, originalValue);
        }
      }
    } else if (value === undefined) {
      value = null;
    }

    if (value === null) {
      if (this.req) {
        return safeParseError('required', this, originalValue);
      }
      if (this.def) {
        return safeParseSuccess(this.def());
      }
      return safeParseSuccess();
    }

    if (typeof value !== 'object' || value === null) {
      return safeParseError('not_object', this, originalValue);
    }

    const discValue = value[this.discriminator];
    if (discValue === undefined) {
      return safeParseError('missing_discriminator', this, originalValue);
    }

    const schema = this.schemaMap.get(discValue);
    if (!schema) {
      return safeParseError('invalid_discriminator', this, originalValue);
    }

    return schema.safeParse(originalValue);
  }

  getErrors(): ValidationErrorRecord {
    throw new Error('Method not implemented.');
  }
}

//
//

type InferSchemaType<T> = T extends ISchema<infer U> ? U : never;

export function distinct<
  Schemas extends readonly ISchema<any>[],
  Discriminator extends string,
>(
  discriminator: Discriminator,
  schemas: Schemas,
): ISchema<InferSchemaType<Schemas[number]>> {
  return new DistinctSchema(discriminator, schemas as any);
}
