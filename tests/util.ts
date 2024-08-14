import { assert } from 'chai';
import { Schema, Issue, CustomIssue } from '../src';

export function assertSchemaIssue(
  schema: Schema<any>,
  issueCode: string,
  value: any,
  customMessage?: string,
) {
  const result = schema.safeParse(value);
  let issue = new Issue(issueCode, schema.meta, value);

  if (issueCode === 'custom') {
    issue = new CustomIssue(customMessage || 'YOU SHOULD DEFINE customMessage', schema.meta, value);
  }

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
