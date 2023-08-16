import { assert } from 'chai';
import { Schema, Issue } from '../src';

export function assertSchemaIssue(
  schema: Schema<any>,
  issueCode: string,
  value: any,
) {
  const result = schema.safeParse(value);
  const issue = new Issue(issueCode, schema.meta, value);

  let resultMessage = '';

  if (result instanceof Issue) {
    resultMessage = result.code;
  } else {
    resultMessage = JSON.stringify(result);
  }

  assert.deepEqual(
    result,
    issue,
    `expected '${issue.code}' error, but received '${resultMessage}'`,
  );
}
