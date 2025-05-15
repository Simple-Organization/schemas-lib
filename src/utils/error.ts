import { type ErrorMessageCode } from '../version2/getErrorMessage';
import type { ISchema } from '../version2/types';
import { SchemaLibError } from '../SchemaLibError';
import { expect } from 'bun:test';

//
//

export function errorTesting(
  code: ErrorMessageCode,
  schema: ISchema<any>,
  value: any,
) {
  const safeParseResult = schema.safeParse(value);

  expect(safeParseResult.success).toBe(false);
  expect(safeParseResult.error).toBeInstanceOf(SchemaLibError);

  const issue = safeParseResult.error!.issues.find((i) => i.code === code);

  expect(safeParseResult.error!.issues.length).toBeGreaterThan(0);
  expect(issue?.code).toBe(code);
}
