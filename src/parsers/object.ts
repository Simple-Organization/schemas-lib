import { Issue, ObjectIssue } from '../Issue';
import {
  ObjectSchema,
  type ObjectMeta,
  type ObjectSchemaRecord,
} from '../schemas/ObjectSchema';
import { Schema } from '../schemas/Schema';

//
//

/**
 * Must be after `cloneObjectParser` because mutates the value object
 */
export function objectParser(
  value: Record<string, any>,
  meta: ObjectMeta,
  originalValue: any,
): Issue | Record<string, any> {
  //
  //  Validates each key of the object

  const shape = meta.shape!;

  let errors: ObjectIssue | undefined;

  //

  const newObject: Record<string, any> = {};

  //

  for (const key of Object.keys(shape)) {
    const parsedProp = shape[key].safeParse(value[key]);

    if (parsedProp === undefined) {
      continue;
    }

    if (parsedProp instanceof Issue) {
      if (!errors) {
        errors = new ObjectIssue('object_shape', meta, originalValue);
      }

      errors.errors[key] = parsedProp;
      continue;
    }

    newObject[key] = parsedProp;
  }

  if (errors) {
    return errors;
  }

  return newObject;
}

//
//

/**
 * Parse the value as JSON if it is a string
 *
 * Validates if the value is an object
 *
 * Must be before most object parsers
 */
export function jsonObjectParser(
  value: any,
  meta: ObjectMeta,
  originalValue: any,
): Issue | Record<string, any> {
  //
  //  If the value is a string, try to parse it as JSON

  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return new Issue('not_valid_json', meta, originalValue);
    }
  }

  //
  //  If the value is not an object, return an error

  if (typeof value !== 'object' || value === null) {
    return new Issue('not_object', meta, originalValue);
  }

  return value;
}

//
//

export function strictObjectParser(
  value: Record<string, any>,
  meta: ObjectMeta,
  originalValue: any,
): Issue | Record<string, any> {
  const shapeKeys = Object.keys(meta.shape!);
  const valueKeys = Object.keys(value);

  const extraKeys = valueKeys.filter((key) => !shapeKeys.includes(key));
  if (extraKeys.length > 0) {
    return new Issue('object_extra_keys', meta, originalValue);
  }

  return value;
}

//
//

export function object<T extends ObjectSchemaRecord>(
  shape: T,
): ObjectSchema<T> {
  //
  //  Validates the value only in development

  if (shape === null || typeof shape !== 'object') {
    throw new Error('The shape must be an object');
  }

  const _shape = {} as ObjectSchemaRecord;

  //
  //  Creates the output schema

  const schema = new ObjectSchema<T>([jsonObjectParser, objectParser], {
    jsType: '',
    shape: _shape,
  });

  //
  //  Creates the shape and clones all child schemas
  //  giving the parent schema to them and setting the name
  let clone: Schema<any>;

  for (const key of Object.keys(shape)) {
    if (!(shape[key] instanceof Schema)) {
      throw new Error(
        `Expected value['${key}'] to be a instance of Schema, but received: ${shape[key]}`,
      );
    }

    clone = /* @__PURE__ */ shape[key].clone();
    clone.meta.name = key;
    _shape[key] = clone;
  }

  schema.meta.shape = _shape;

  schema.meta.jsType =
    '{' +
    Object.keys(_shape)
      .map((key) => {
        let prop = '"' + key.replace(/"/g, '\\"') + '"';
        let postfix = '';

        if (_shape[key].meta.mode === 'optional') {
          prop += '?';
        } else if (_shape[key].meta.mode === 'nullish') {
          prop += '?';
          postfix += '|null';
        } else if (_shape[key].meta.mode === 'nullable') {
          postfix += '|null';
        }

        let jsType = _shape[key].meta.jsType;

        if (_shape[key].meta.namedJSType) {
          jsType = _shape[key].meta.namedJSType;
        }

        return prop + ':' + jsType + postfix;
      })
      .join(';') +
    '}';

  return schema;
}

//
//

/**
 * - Equal to `object`
 * - Does not allow extra keys
 */
export function strict<T extends ObjectSchemaRecord>(
  shape: T,
): ObjectSchema<T> {
  const objectSchema = /* @__PURE__ */ object(shape);

  objectSchema.parsers = [jsonObjectParser, strictObjectParser, objectParser];

  return objectSchema;
}

/**
 * - `strict` with a name
 * - Does not allow extra keys
 * - Does additonal validation on **\_\_DEV\_\_**
 * - Add columnName and tableName childs in **\_\_DEV\_\_**
 */
export function table<T extends ObjectSchemaRecord>(
  tableName: string,
  shape: T,
): ObjectSchema<T> {
  const objectSchema = /* @__PURE__ */ strict(shape);

  objectSchema.meta.name = tableName;

  //
  // Does not need to clone the shape because it is already cloned

  Object.keys(objectSchema.shape).forEach((key) => {
    const child = objectSchema.shape[key];

    if (child.meta.mode === 'nullable' || child.meta.mode === 'optional') {
      throw new Error(
        `You can't use nullable or optional schemas in a table schema. Use nullish or required instead.`,
      );
    }

    let db = child.meta.db;
    if (!db) {
      db = {};
      child.meta.db = db;
    }

    db.columnName = key;
    db.tableOwner = objectSchema;
  });

  return objectSchema;
}
