import { describe, test } from 'mocha';
import { assert } from 'chai';
import { int, intParser } from '../../src/parsers/int';
import { Issue, SchemaMeta } from '../../src';
import { assertSchemaIssue } from '../util';

describe('int schema', () => {
  //
  //

  test('Deve executar intParser o parser com sucesso', () => {
    const meta: SchemaMeta = { jsType: 'number', db: { type: 'INTEGER' } };

    function assertIssue(value: any, code: string) {
      assert.deepEqual(
        intParser(value, meta, value),
        new Issue(code, meta, value),
      );
    }

    assert.equal(intParser(1, meta, 1), 1);
    assert.equal(intParser('1', meta, '1'), 1);
    assert.equal(intParser('   1   ', meta, '   1   '), 1);

    assertIssue(1.2, 'not_integer');
    assertIssue('1.2', 'not_number_string');
    assertIssue('asdf', 'not_number_string');
    assertIssue(new Date(), 'not_number_type');
    assertIssue({}, 'not_number_type');
    assertIssue([], 'not_number_type');
    assertIssue(true, 'not_number_type');
    assertIssue(false, 'not_number_type');
    assertIssue(+'asdf', 'not_integer');
    assertIssue(Number.POSITIVE_INFINITY, 'not_integer');
    assertIssue(Number.NEGATIVE_INFINITY, 'not_integer');
  });

  //
  //

  test('Deve executar o schema int com mutators minNumber e maxNumber', () => {
    const intMin1 = int.min(1);
    const intMax1 = int.max(1);

    assert.deepEqual(intMin1.meta, {
      jsType: 'number',
      min: 1,
    });

    assert.deepEqual(intMax1.meta, {
      jsType: 'number',
      max: 1,
    });

    assertSchemaIssue(intMin1, 'min_number', 0);
    assertSchemaIssue(intMax1, 'max_number', 2);
  });

  //
  //

  test('Deve dar catch com sucesso', () => {
    const intMin1 = int.min(1).catch(1);

    assert.deepEqual(intMin1.parse(0), 1);
    assert.deepEqual(intMin1.safeParse(0), 1);
  });

  //
  //

  test('int.default() sem argumentos deve fazer safeParse() e retornar undefined', () => {
    const intMin1 = int.default();

    assert.deepEqual(intMin1.parse(1), 1);
    assert.deepEqual(intMin1.parse(undefined), undefined);
  });
});
