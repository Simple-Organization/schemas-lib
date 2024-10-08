import type { SchemaMeta, SchemaParser } from '../types';
import { Schema } from './Schema';

//
//

export interface ObjectMeta extends SchemaMeta {
  shape?: ObjectSchemaRecord;
}

//
//

export type ObjectSchemaRecord = Record<string, Schema<any>>;

//
//

type OptionalKeys<T extends ObjectSchemaRecord> = {
  [k in keyof T]: undefined extends T[k]['_o'] ? k : never;
}[keyof T];

type RequiredKeys<T extends ObjectSchemaRecord> = {
  [k in keyof T]: undefined extends T[k]['_o'] ? never : k;
}[keyof T];

// Concat required and optional keys
type MakePartial<T extends ObjectSchemaRecord> = {
  [k in RequiredKeys<T> as T[k] extends never ? never : k]: T[k]['_o'];
} & {
  [k in OptionalKeys<T> as T[k] extends never ? never : k]?: T[k]['_o'];
};

//
//

export class ObjectSchema<T = ObjectSchemaRecord> extends Schema<
  T extends ObjectSchemaRecord ? MakePartial<T> : T
> {
  declare meta: ObjectMeta;

  constructor(parsers: SchemaParser[], meta: ObjectMeta) {
    super(parsers, meta);

    if (typeof meta.shape !== 'object' || meta.shape === null) {
      throw new Error(
        'You must provide a shape to the object schema and must be an object',
      );
    }
  }

  clone(): typeof this {
    const shape = { ...this.meta.shape! };

    const clone = /* @__PURE__ */ new (this.constructor as any)(
      [...this.parsers],
      {
        ...this.meta,
        shape,
      },
    );

    return clone as any;
  }

  get shape(): T {
    return this.meta.shape as any;
  }

  set shape(value: T) {
    this.meta.shape = value as any;
  }

  //
  //

  omit<Mask extends { [k in keyof T]?: true }>(
    mask: Mask,
  ): ObjectSchema<Omit<T, keyof Mask>> {
    const newShape: any = {};
    const currentShape = this.meta.shape!;

    Object.keys(currentShape).forEach((key) => {
      if (!(mask as any)[key]) {
        newShape[key] = currentShape[key];
      }
    });

    const clone = this.clone();
    clone.meta.shape = newShape;

    return clone as any;
  }

  //
  //

  pick<Mask extends { [k in keyof T]?: true }>(
    mask: Mask,
  ): ObjectSchema<Pick<T, Extract<keyof T, keyof Mask>>> {
    const shape: any = {};
    const currentShape = this.meta.shape!;

    Object.keys(currentShape).forEach((key) => {
      if ((mask as any)[key]) {
        shape[key] = currentShape[key];
      }
    });

    const clone = this.clone();
    clone.meta.shape = shape;

    return clone as any;
  }
}

//
//
