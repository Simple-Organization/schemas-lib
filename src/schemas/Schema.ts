import { Mutator, SchemaMeta, SchemaParser } from '../types';
import { Issue, IssueError } from '../Issue';

//
//

export class Schema<T> {
  /** Property used only for type inference */
  declare readonly _o: T;
  /** Quando tem default e irá executar parse, cria um clone desse Schema e salva ele como default */
  private declare _defaultReq?: Schema<T>;
  meta: SchemaMeta;

  constructor(
    public parsers: SchemaParser[],
    meta?: SchemaMeta,
  ) {
    if (parsers.length === 0) {
      throw new Error('You must provide at least one parser to the schema');
    }

    this.meta = meta || { jsType: 'number' };
  }

  //
  //  Important methods
  //

  clone(): typeof this {
    const clone = /* @__PURE__ */ new (this.constructor as any)(
      [...this.parsers],
      {
        ...this.meta,
      },
    );

    return clone as any;
  }

  //
  //  Schema info about optional, nullable, nullish, required
  //

  optional(): Schema<Exclude<T, null> | undefined> {
    return /* @__PURE__ */ cloneChangingMode(this, 'optional') as any;
  }

  nullable(): Schema<Exclude<T, undefined> | null> {
    return /* @__PURE__ */ cloneChangingMode(this, 'nullable') as any;
  }

  nullish(): Schema<T | null | undefined> {
    return /* @__PURE__ */ cloneChangingMode(this, 'nullish') as any;
  }

  required(): Schema<Exclude<T, undefined | null>> {
    return /* @__PURE__ */ cloneChangingMode(this, 'required') as any;
  }

  /**
   * Set to default value when the value is null or undefined
   *
   * AND IT SETs TO NULLISH MODE
   */
  default(
    defaultSetter?: T | null | ((value: null | undefined) => T),
  ): Schema<T | null | undefined> {
    const clone = this.clone();

    // @ts-ignore
    clone.meta.default =
      typeof defaultSetter === 'function' ? defaultSetter : () => defaultSetter;
    clone.meta.mode = 'nullish';

    return clone as any;
  }

  /**
   * Set default with `meta.catch = true`
   */
  catch(
    defaultSetter?: T | null | ((value: null | undefined) => T),
  ): Schema<T | null | undefined> {
    const clone = this.default(defaultSetter);
    clone.meta.catch = true;

    return clone as any;
  }

  /**
   * Pipe changes to the schema
   */
  pipe(...pipesMutators: Mutator[]): typeof this {
    const clone = /* @__PURE__ */ this.clone();
    for (const mutator of pipesMutators) {
      mutator(clone);
    }
    return clone as any;
  }

  /**
   * Clona o Schema atual e adiciona um parser
   */
  addParser(parser: SchemaParser): typeof this {
    const clone = /* @__PURE__ */ this.clone();
    clone.parsers.push(parser);
    return clone as any;
  }

  //
  //  Parses
  //

  safeParse(originalValue: any): T | Issue {
    const meta = this.meta;

    let parsed = originalValue;

    for (const parser of this.parsers) {
      if (parsed === '') {
        if (meta.default) {
          return this._sendDefault(parsed);
        }
        parsed = null;
      }

      if (parsed === null) {
        if (meta.mode === 'nullable' || meta.mode === 'nullish') {
          if (meta.default) {
            return this._sendDefault(parsed);
          }

          return parsed;
        }

        if (meta.mode === 'optional') {
          return new Issue('not_nullable', meta, originalValue);
        }

        return new Issue('required', meta, originalValue);
      }

      if (parsed === undefined) {
        if (meta.mode === 'optional' || meta.mode === 'nullish') {
          if (meta.default) {
            return this._sendDefault(parsed);
          }

          return parsed;
        }

        if (meta.mode === 'nullable') {
          return new Issue('not_optional', meta, originalValue);
        }

        return new Issue('required', meta, originalValue);
      }

      parsed = parser(parsed, meta, originalValue);

      if (parsed instanceof Issue) {
        break;
      }
    }

    return parsed;
  }

  /**
   * Parse the value, throw IssueError when the value is invalid, but returns default value when `meta.catch = true`
   */
  parse(originalValue: any): T {
    const parsed = this.safeParse(originalValue);

    if (parsed instanceof Issue) {
      if (this.meta.catch) {
        return this._sendDefault(parsed) as T;
      }

      throw new IssueError(parsed);
    }

    return parsed;
  }

  /**
   * Typed alias to parse
   */
  declare tparse: (originalValue: T) => T;

  /**
   * Typed alias to safeParse
   */
  declare tsafeParse: (originalValue: T) => T | Issue;

  /**
   * Adiciona informação ao `meta`
   */
  info(meta: SchemaMeta) {
    const clone = /* @__PURE__ */ this.clone();
    clone.meta = { ...clone.meta, ...meta };
    return clone;
  }

  /**
   * Adiciona informação de erros de validação ao `meta`
   */
  errors(
    errors: Record<
      string,
      string | ((originalValue: any, meta: SchemaMeta) => string)
    >,
  ) {
    const clone = /* @__PURE__ */ this.clone();
    clone.meta = { ...clone.meta, errors };
    return clone;
  }

  /**
   * Send to default value when the value is null or undefined
   *
   * Clones the current Schema and saves it as required
   */
  private _sendDefault(parsed: any) {
    if (!this._defaultReq) {
      this._defaultReq = this.required() as any;
    }

    return this._defaultReq!.safeParse(this.meta.default!(parsed));
  }
}

Schema.prototype.tparse = Schema.prototype.parse;
Schema.prototype.tsafeParse = Schema.prototype.safeParse;

//
//

function cloneChangingMode(
  shema: Schema<any>,
  mode: 'required' | 'optional' | 'nullable' | 'nullish',
) {
  const cloned = shema.clone();
  cloned.meta.mode = mode;
  return cloned;
}
