import { describe, test } from 'mocha';
import { CustomIssue, Issue, Schema, SchemaMeta } from '../../src';
import { assert } from 'chai';

describe('CustomIssue', () => {
  //
  //

  test('Deve exibir o erro de validação Custom adequadamente', () => {
    const schema = new Schema([parser]);

    //
    // parser that when receives 'any' returns an Issue

    function parser(
      value: any,
      meta: SchemaMeta,
      originalValue: any,
    ): Issue | number {
      if (value === 'any') {
        return new CustomIssue('Some error', meta, originalValue);
      }
      return value;
    }

    //
    //

    const parsed = schema.safeParse('any');

    assert.deepEqual(
      parsed,
      new CustomIssue('Some error', { jsType: 'unknown' }, 'any'),
    );
  });
});
