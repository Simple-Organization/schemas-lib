///////////////////////////
////     base type     ////
///////////////////////////
export interface $ZodIssueBase {
  readonly code?: string;
  readonly input?: unknown;
  readonly path: PropertyKey[];
  readonly message: string;
  // [k: string]: unknown;
}

////////////////////////////////
////     issue subtypes     ////
////////////////////////////////
export interface $ZodIssueInvalidType<Input = unknown> extends $ZodIssueBase {
  readonly code: 'invalid_type';
  readonly expected: $ZodType['_zod']['def']['type'];
  readonly input: Input;
}

export interface $ZodIssueTooBig<Input = unknown> extends $ZodIssueBase {
  readonly code: 'too_big';
  readonly origin:
    | 'number'
    | 'int'
    | 'bigint'
    | 'date'
    | 'string'
    | 'array'
    | 'set'
    | 'file'
    | (string & {});
  readonly maximum: number | bigint;
  readonly inclusive?: boolean;
  readonly input: Input;
}

export interface $ZodIssueTooSmall<Input = unknown> extends $ZodIssueBase {
  readonly code: 'too_small';
  readonly origin:
    | 'number'
    | 'int'
    | 'bigint'
    | 'date'
    | 'string'
    | 'array'
    | 'set'
    | 'file'
    | (string & {});
  readonly minimum: number | bigint;
  readonly inclusive?: boolean;
  readonly input: Input;
}

export interface $ZodIssueInvalidStringFormat extends $ZodIssueBase {
  readonly code: 'invalid_format';
  readonly format: $ZodStringFormats | (string & {});
  readonly pattern?: string;
  readonly input: string;
}

export interface $ZodIssueNotMultipleOf<
  Input extends number | bigint = number | bigint,
> extends $ZodIssueBase {
  readonly code: 'not_multiple_of';
  readonly divisor: number;
  readonly input: Input;
}

export interface $ZodIssueUnrecognizedKeys extends $ZodIssueBase {
  readonly code: 'unrecognized_keys';
  readonly keys: string[];
  readonly input: Record<string, unknown>;
}

export interface $ZodIssueInvalidUnion extends $ZodIssueBase {
  readonly code: 'invalid_union';
  readonly errors: $ZodIssue[][];
  readonly input: unknown;
}

export interface $ZodIssueInvalidKey<Input = unknown> extends $ZodIssueBase {
  readonly code: 'invalid_key';
  readonly origin: 'map' | 'record';
  readonly issues: $ZodIssue[];
  readonly input: Input;
}

export interface $ZodIssueInvalidElement<Input = unknown>
  extends $ZodIssueBase {
  readonly code: 'invalid_element';
  readonly origin: 'map' | 'set';
  readonly key: unknown;
  readonly issues: $ZodIssue[];
  readonly input: Input;
}

export interface $ZodIssueInvalidValue<Input = unknown> extends $ZodIssueBase {
  readonly code: 'invalid_value';
  readonly values: util.Primitive[];
  readonly input: Input;
}

export interface $ZodIssueCustom extends $ZodIssueBase {
  readonly code?: 'custom';
  readonly params?: Record<string, any> | undefined;
  readonly input: unknown;
}

////////////////////////////////////////////
////     first-party string formats     ////
////////////////////////////////////////////

export interface $ZodIssueStringCommonFormats
  extends $ZodIssueInvalidStringFormat {
  format: Exclude<
    $ZodStringFormats,
    'regex' | 'jwt' | 'starts_with' | 'ends_with' | 'includes'
  >;
}

export interface $ZodIssueStringInvalidRegex
  extends $ZodIssueInvalidStringFormat {
  format: 'regex';
  pattern: string;
}

export interface $ZodIssueStringInvalidJWT
  extends $ZodIssueInvalidStringFormat {
  format: 'jwt';
  algorithm?: string;
}

export interface $ZodIssueStringStartsWith
  extends $ZodIssueInvalidStringFormat {
  format: 'starts_with';
  prefix: string;
}

export interface $ZodIssueStringEndsWith extends $ZodIssueInvalidStringFormat {
  format: 'ends_with';
  suffix: string;
}

export interface $ZodIssueStringIncludes extends $ZodIssueInvalidStringFormat {
  format: 'includes';
  includes: string;
}

export type $ZodStringFormatIssues =
  | $ZodIssueStringCommonFormats
  | $ZodIssueStringInvalidRegex
  | $ZodIssueStringInvalidJWT
  | $ZodIssueStringStartsWith
  | $ZodIssueStringEndsWith
  | $ZodIssueStringIncludes;

////////////////////////
////     utils     /////
////////////////////////

export type $ZodIssue =
  | $ZodIssueInvalidType
  | $ZodIssueTooBig
  | $ZodIssueTooSmall
  | $ZodIssueInvalidStringFormat
  | $ZodIssueNotMultipleOf
  | $ZodIssueUnrecognizedKeys
  | $ZodIssueInvalidUnion
  | $ZodIssueInvalidKey
  | $ZodIssueInvalidElement
  | $ZodIssueInvalidValue
  | $ZodIssueCustom;

export type $ZodRawIssue<T extends $ZodIssueBase = $ZodIssue> = T extends any
  ? RawIssue<T>
  : never;
type RawIssue<T extends $ZodIssueBase> = util.Flatten<
  util.MakePartial<T, 'message' | 'path'> & {
    /** The input data */
    readonly input?: unknown;
    /** The schema or check that originated this issue. */
    readonly inst?: $ZodType | $ZodCheck;
    /** @deprecated Internal use only. If `true`, Zod will continue executing validation despite this issue. */
    readonly continue?: boolean | undefined;
  } & Record<string, any>
>;

export interface $ZodErrorMap<T extends $ZodIssueBase = $ZodIssue> {
  // biome-ignore lint:
  (issue: $ZodRawIssue<T>): { message: string } | string | undefined | null;
}
