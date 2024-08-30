import { describe, test } from 'mocha';
import { assert } from 'chai';
import { int } from '../../src';
import { array } from '../../src/parsers/array';
import { assertSchemaIssue } from '../util';

describe('array schema', () => {
  //
  //

  test('Deve ter gerado a tipagem com sucesso', () => {
    const arrayInt = array(int());

    assert.equal(arrayInt.meta.jsType, '(number)[]');
  });

  //
  //

  test('Deve executar parse do array com sucesso', () => {
    const arrayInt = array(int());

    assert.deepEqual(arrayInt.safeParse([]), []);
    assert.deepEqual(arrayInt.safeParse([1, 2, 3]), [1, 2, 3]);
    assert.deepEqual(arrayInt.safeParse('[1, 2, 3]'), [1, 2, 3]);
    assert.deepEqual(arrayInt.safeParse('["1", "2", "3"]'), [1, 2, 3]);

    assertSchemaIssue(arrayInt, 'not_array', -1);

    assert.equal(
      arrayInt.safeParse([{}]).toString(),
      `{"0":"Esperava um tipo 'number' recebeu 'object'"}`,
    );
  });

  //
  //

  test('Deve checar se a array tem cumprimento específico', () => {
    const arrayInt = array(int()).between(2, 4);

    assertSchemaIssue(arrayInt, 'min_array_length', ['0']);
    assertSchemaIssue(arrayInt, 'min_array_length', []);
    assertSchemaIssue(arrayInt, 'max_array_length', ['0', 1, 2, 3, 4]);

    assert.deepEqual(arrayInt.safeParse(['1', 2]), [1, 2]);
    assert.deepEqual(arrayInt.safeParse([1, 2, 3, 4]), [1, 2, 3, 4]);
  });
});
