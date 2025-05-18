import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';
import { jsonPreprocess } from '../preprocess/jsonPreprocess';
import { EMPTY_VALUE } from '../symbols';

//
//

export class ArraySchema<S extends Schema<any>> extends Schema<
  Array<S extends Schema<infer E> ? E : never>
> {
  element: S;
  /** Property used only for type inference */
  declare readonly _o: Array<S extends Schema<infer E> ? E : never>;
  declare readonly isSchema: true;

  req = true;

  //
  //

  constructor(readonly elementSchema: S) {
    super();
    this.element = elementSchema;
  }

  process(p: ParseContext): void {
    //
    //  If the value is not an array, return an error

    if (!Array.isArray(p.value)) {
      return p.error('not_array');
    }

    //
    //  Validates each element of the array

    const output: any[] = [];

    //
    // Saves the previous state of ParseContext like object does
    const { value: values, original, path } = p;

    let hasError = false;
    const element = this.element as any as Schema<any>;
    p.schema = element;
    let newPath = path.slice();

    //
    //

    for (let i = 0; i < values.length; i++) {
      newPath.push(i);
      p.path = newPath;
      p.value = values[i];
      p.original = values[i];
      p.hasError = false;

      element.preprocess(p);

      if (p.value === EMPTY_VALUE) {
        output[i] = element.processEmpty(p);

        if (p.hasError) {
          hasError = true;
          newPath = path.slice();
          continue;
        }

        newPath.pop();
        continue;
      } else if (p.hasError) {
        hasError = true;
        output[i] = p.value;
        newPath = path.slice();
        continue;
      }

      element.process(p);
      if (p.hasError) {
        hasError = true;
        newPath = path.slice();
      }

      // console.log('p depois process', { ...p, schema: undefined });

      output[i] = p.value;
    }

    p.path = path;
    p.value = output;
    p.original = original;
    p.schema = this;
    p.hasError = hasError;
  }
}

//
//

ArraySchema.prototype.preprocess = jsonPreprocess;

//
//

export function array<T extends Schema<any>>(elementSchema: T): ArraySchema<T> {
  return new ArraySchema(elementSchema);
}
