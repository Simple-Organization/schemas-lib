import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';
import { jsonPreprocess } from '../preprocess/jsonPreprocess';
import { EMPTY_VALUE } from '../symbols';

//
//

export class RecordSchema<V extends Schema<any>> extends Schema<
  Record<string, V['_o']>
> {
  valueSchema: V;
  /** Property used only for type inference */
  declare readonly _o: Record<string, V['_o']>;
  declare readonly isSchema: true;

  req = true;

  constructor(valueSchema: V) {
    super();
    if (
      typeof valueSchema !== 'object' ||
      valueSchema === null ||
      !(valueSchema as any).isSchema
    ) {
      throw new Error('You must provide a Schema as the value type for record');
    }
    this.valueSchema = valueSchema;
  }

  /** Uses jsonPreprocess */
  declare preprocess: (p: ParseContext) => void;

  process(p: ParseContext): void {
    if (
      typeof p.value !== 'object' ||
      p.value === null ||
      Array.isArray(p.value)
    ) {
      return p.error('not_object');
    }
    const input = p.value as Record<string, unknown>;
    const output: Record<string, V['_o']> = {};
    const { value, original, path } = p;
    let hasError = false;
    let newPath = path.slice();
    const valueSchema = this.valueSchema;
    p.schema = valueSchema;

    for (const key of Object.keys(input)) {
      newPath.push(key);
      p.path = newPath;
      p.value = input[key];
      p.original = input[key];
      p.hasError = false;

      valueSchema.preprocess(p);

      if (p.value === EMPTY_VALUE) {
        // If the value is empty, we don't want to add it to the output
        newPath.pop();
        continue;
      }

      if (p.hasError) {
        hasError = true;
        newPath = path.slice();
        continue;
      }

      valueSchema.process(p);

      if (p.hasError) {
        hasError = true;
        newPath = path.slice();
        output[key] = p.value;
        continue;
      }

      output[key] = p.value;
      newPath.pop();
    }

    p.path = path;
    p.value = value;
    p.original = original;
    p.schema = this;
    p.hasError = hasError;
    p.value = output;
  }
}

RecordSchema.prototype.preprocess = jsonPreprocess;

export function record<V extends Schema<any>>(valueSchema: V): RecordSchema<V> {
  return new RecordSchema(valueSchema);
}
