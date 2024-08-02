import { Issue, ObjectIssue } from '../Issue';
import { ArrayMeta, ArraySchema } from '../schemas/ArraySchema';
import { ObjectSchema } from '../schemas/ObjectSchema';
import { Schema } from '../schemas/Schema';

//
//

export function arrayParser(
  value: any,
  meta: ArrayMeta,
  originalValue: any,
): Issue | any[] {
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
  //  If the value is not an array, return an error

  if (!Array.isArray(value)) {
    return new Issue('not_array', meta, originalValue);
  }

  //
  //  Clone the array

  const arrayClone = [...value];

  //
  //  Parse each element

  const element = meta.element!;

  let errors: ObjectIssue | undefined;

  //

  for (let i = 0; i < arrayClone.length; i++) {
    const parsedProp = element.safeParse(arrayClone[i]);

    if (parsedProp instanceof Issue) {
      if (!errors) {
        errors = new ObjectIssue('array_shape', meta, originalValue);
      }

      errors.errors[i] = parsedProp;
    } else {
      arrayClone[i] = parsedProp;
    }
  }

  //

  if (errors) {
    return errors;
  }

  return arrayClone;
}

//
//

export function array<T>(
  element: Schema<T> | ObjectSchema<T>,
): ArraySchema<T[], Schema<T[]>> {
  if (!(element instanceof Schema)) {
    throw new Error('The element must be a instance of Schema');
  }

  let jsType = element.meta.jsType;

  if (element.meta.namedJSType) {
    jsType = element.meta.namedJSType;
  }

  const schema = new ArraySchema([arrayParser], {
    jsType: `(${jsType})[]`,
    element,
  });

  return schema;
}
