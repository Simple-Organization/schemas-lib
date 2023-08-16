import { describe, test } from 'mocha';
import { assert } from 'chai';
import { assertSchemaIssue } from '../util';
import { boolean } from '../../src';

describe('boolean schema', () => {
  //
  //

  test('Deve executar o schema boolean com sucesso', () => {
    assert.equal(boolean.meta.jsType, 'boolean');

    assert.equal(boolean.safeParse(true), true);
    assert.equal(boolean.safeParse(1), true);
    assert.equal(boolean.safeParse('on'), true); // For checkbox
    assert.equal(boolean.safeParse('1'), true);
    assert.equal(boolean.safeParse('true'), true);

    assert.equal(boolean.safeParse(false), false);
    assert.equal(boolean.safeParse(0), false);
    assert.equal(boolean.safeParse('off'), false); // For checkbox
    assert.equal(boolean.safeParse('0'), false);
    assert.equal(boolean.safeParse('false'), false);

    assertSchemaIssue(boolean, 'boolean_type', -1);
    assertSchemaIssue(boolean, 'boolean_type', new Map());
    assertSchemaIssue(boolean, 'boolean_type', new Date());
    assertSchemaIssue(boolean, 'boolean_type', 'a');
    assertSchemaIssue(boolean, 'required', '');
    assertSchemaIssue(boolean, 'required', null);
  });
});
