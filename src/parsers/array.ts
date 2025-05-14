import type { ISchema, ParseContext, SafeParseReturn } from '../version2/types';
import { Schema } from '../version2/Schema';
import { jsonPreprocess } from '../preprocess/jsonPreprocess';

//
//

export class ArraySchema<S extends ISchema<any>>
  implements ISchema<Array<S extends ISchema<infer E> ? E : never>>
{
  element: S;
  /** Property used only for type inference */
  declare readonly _o: Array<S extends ISchema<infer E> ? E : never>;
  declare readonly isSchema: true;

  req = true;

  def?: () => Array<S extends ISchema<infer E> ? E : never>;

  //
  //

  constructor(readonly elementSchema: S) {
    this.element = elementSchema;
  }

  /** Uses jsonPreprocess */
  declare preprocess: (p: ParseContext) => void;

  process(p: ParseContext): void {
    //
    //  If the value is not an array, return an error

    if (!Array.isArray(p.value)) {
      return p.error('not_array');
    }

    //
    //  Validates each element of the array

    const results: SafeParseReturn<any>[] = [];
    const output: any[] = [];

    //
    // Saves the previous state of ParseContext like object does
    const { value: values, original, path } = p;

    let hasError = false;
    const element = this.element as any as Schema<any>;
    p.schema = element;

    //
    //

    for (let i = 0; i < values.length; i++) {
      path.push(i);
      p.value = values[i];
      p.original = values[i];
      p.hasError = false;

      // console.log('p antes preprocess', { ...p, schema: undefined });

      element.preprocess(p);

      // console.log('p depois preprocess', { ...p, schema: undefined });

      if (p.hasError) {
        hasError = true;
        output[i] = p.value;
        path.pop();
        continue;
      } else if (p.value === null) {
        output[i] = p.value;
        path.pop();
        continue;
      }

      element.process(p);
      if (p.hasError) {
        hasError = true;
      }

      // console.log('p depois process', { ...p, schema: undefined });

      output[i] = p.value;
      path.pop();
    }

    p.value = output;
    p.original = original;
    p.schema = this;
    p.hasError = hasError;
  }

  //
  //  Schema info about optional, required, default
  //

  declare optional: () => ISchema<
    | Exclude<Array<S extends ISchema<infer E> ? E : never>, null>
    | null
    | undefined
  >;
  /** Set to default value when the value is null or undefined */
  declare default: (
    defaultSetter:
      | (() => Array<S extends ISchema<infer E> ? E : never>)
      | Array<S extends ISchema<infer E> ? E : never>,
  ) => ArraySchema<S>;
  /**
   * Parse the value, throw {@link SafeParseReturn} when the value is invalid
   */
  declare parse: (
    originalValue: any,
  ) => Array<S extends ISchema<infer E> ? E : never>;
  /**
   * Parse the value, return {@link SafeParseReturn} when the value is invalid
   */
  declare safeParse: (
    originalValue: any,
  ) => SafeParseReturn<Array<S extends ISchema<infer E> ? E : never>>;
}

//
//

ArraySchema.prototype.preprocess = jsonPreprocess;
ArraySchema.prototype.optional = Schema.prototype.optional as any;
ArraySchema.prototype.default = Schema.prototype.default as any;
ArraySchema.prototype.safeParse = Schema.prototype.safeParse as any;
ArraySchema.prototype.parse = Schema.prototype.parse as any;
(ArraySchema.prototype as any).isSchema = true;

//
//

export function array<T extends ISchema<any>>(
  elementSchema: T,
): ArraySchema<T> {
  return new ArraySchema(elementSchema);
}
