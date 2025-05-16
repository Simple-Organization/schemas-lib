import { type ErrorMessageCode } from '../version2/getErrorMessage';
import { type Schema } from '../version2/Schema';
import { SchemaLibError } from '../SchemaLibError';
import { expect } from 'bun:test';

//
//

export function errorTesting(
  code: ErrorMessageCode,
  schema: Schema<any>,
  value: any,
) {
  const safeParseResult = schema.safeParse(value);

  expect(safeParseResult.success).toBe(false);
  if (safeParseResult.success) return; // This line is unreachable, but it helps with type inference
  expect(safeParseResult.error).toBeInstanceOf(SchemaLibError);

  const issue = safeParseResult.error!.issues.find((i) => i.code === code);

  expect(safeParseResult.error!.issues.length).toBeGreaterThan(0);
  if (issue?.code !== code && issue?.code) {
    console.error(
      `Expected error code ${code}, but got ${issue.code} instead.`,
    );
  }

  expect(issue?.code).toBe(code);
}
