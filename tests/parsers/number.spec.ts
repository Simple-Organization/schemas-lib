import { describe, test } from 'mocha';
import { assert } from 'chai';
import { assertSchemaIssue } from '../util';
import { Issue, SchemaMeta, float, number } from '../../src';
import { numberParser } from '../../src/parsers/number';

describe('number schema', () => {
  //
  //

  test('Deve executar numberParser o parser com sucesso', () => {
    const meta: SchemaMeta = {
      jsType: 'number',
      db: { type: 'REAL' },
    };

    function assertIssue(value: any, code: string) {
      assert.deepEqual(
        numberParser(value, meta, value),
        new Issue(code, meta, value),
      );
    }

    assert.equal(numberParser(1, meta, 1), 1);
    assert.equal(numberParser('1', meta, '1'), 1);
    assert.equal(numberParser('   1   ', meta, '   1   '), 1);
    assert.equal(numberParser('   1.2   ', meta, '   1.2   '), 1.2);
    assert.equal(
      numberParser(Number.POSITIVE_INFINITY, meta, Number.POSITIVE_INFINITY),
      Number.POSITIVE_INFINITY,
    );
    assert.equal(
      numberParser(Number.NEGATIVE_INFINITY, meta, Number.NEGATIVE_INFINITY),
      Number.NEGATIVE_INFINITY,
    );
    assert.equal(
      numberParser('   Infinity   ', meta, '   Infinity   '),
      Number.POSITIVE_INFINITY,
    );

    assertIssue('asdf', 'nan');
    assertIssue(NaN, 'nan');
    assertIssue(new Date(), 'not_number_type');
    assertIssue({}, 'not_number_type');
    assertIssue([], 'not_number_type');
    assertIssue(true, 'not_number_type');
    assertIssue(false, 'not_number_type');
    assertIssue(+'asdf', 'nan');
  });

  //
  //

  test('Deve executar o schema number com os parsers minNumber e maxNumber', () => {
    const numberMin1 = number().min(1);
    const numberMax1 = number().max(1);

    assert.deepEqual(numberMin1.meta, {
      jsType: 'number',
      min: 1,
    });

    assert.deepEqual(numberMax1.meta, {
      jsType: 'number',
      max: 1,
    });

    assertSchemaIssue(numberMin1, 'min_number', 0);
    assertSchemaIssue(numberMax1, 'max_number', 2);
  });

  //
  //

  test('Deve executar o schema number com o parser between', () => {
    const numberBet = number().between(1, 3);

    assert.deepEqual(numberBet.meta, {
      jsType: 'number',
      min: 1,
      max: 3,
    });

    assert.equal(numberBet.parse(1), 1);
    assert.equal(numberBet.parse(2), 2);
    assert.equal(numberBet.parse(3), 3);

    assertSchemaIssue(numberBet, 'min_number', 0);
    assertSchemaIssue(numberBet, 'max_number', 4);
  });

  //
  //

  test('Deve executar o float e checar se o valor é finito', () => {
    assert.deepEqual(float().meta, {
      jsType: 'number',
    });

    assertSchemaIssue(float(), 'not_finite', Number.POSITIVE_INFINITY);
    assertSchemaIssue(float(), 'not_finite', Number.NEGATIVE_INFINITY);
  });
});
