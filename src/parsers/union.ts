import type { Issue, ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';

//
//

// Utilitário para extrair o tipo de saída de um Schema
type OutputOf<T> = T extends Schema<infer O> ? O : never;

export class UnionSchema<S extends readonly Schema<any>[]> extends Schema<
  OutputOf<S[number]>
> {
  schemas: S;
  /** Property used only for type inference */
  declare readonly _o: OutputOf<S[number]>;

  req = true;

  //
  //

  constructor(schemas: S) {
    super();
    if (!Array.isArray(schemas) || schemas.length < 2) {
      throw new Error(
        `You must provide at least 2 schemas for the union. Received: ${schemas.length}`,
      );
    }
    if (schemas.some((v) => typeof v !== 'object' || !(v as any).isSchema)) {
      throw new Error(
        `All values of the union must be Schema. Received: ${schemas}`,
      );
    }
    this.schemas = schemas;
  }

  /** Does nothing */
  declare preprocess: (p: ParseContext) => void;

  process(p: ParseContext): void {
    //
    // Saves the previous state of ParseContext like object does
    const { value: values, issues } = p;
    let firstIssues: Issue[] | null = null;
    let firstValue: any = null;

    //

    for (const schema of this.schemas as any as Schema<any>[]) {
      p.schema = schema;
      p.value = values;
      p.issues = []; // Reset issues for each schema

      // console.log('p antes preprocess', {
      //   ...p,
      //   schema: undefined,
      // });

      schema.preprocess(p);

      // console.log('p depois preprocess', {
      //   ...p,
      //   schema: undefined,
      // });

      if (p.hasError) {
        p.hasError = false;

        if (!firstIssues) {
          firstIssues = p.issues;
          firstValue = p.value;
        }
        continue;
      }

      schema.process(p);

      // console.log('p depois process', {
      //   ...p,
      //   schema: undefined,
      // });

      if (p.hasError) {
        p.hasError = false;

        if (!firstIssues) {
          firstIssues = p.issues;
          firstValue = p.value;
        }
      } else {
        firstIssues = null; // Reset firstIssues if a schema successfully parsed the value
        p.issues = issues; // Reset issues to the original context
        break; // Exit the loop if a schema successfully parsed the value
      }
    }

    if (firstIssues) {
      p.issues = [...issues, ...firstIssues];
      p.value = firstValue;
      p.hasError = true;
      p.error('union_no_match');
    }
  }
}

//
//

export function union<T extends readonly Schema<any>[]>(
  schemas: T,
): UnionSchema<T> {
  return new UnionSchema(schemas);
}
