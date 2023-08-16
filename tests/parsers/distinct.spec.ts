import { describe, test } from 'mocha';
import { assert } from 'chai';
import { assertSchemaIssue } from '../util';
import { distinct, literal } from '../../src/parsers/distinct';
import { Issue, object } from '../../src';

describe('distinct schema', () => {
  //
  //

  test('Deve executar parse do literal com sucesso', () => {
    const _literal = literal(1);

    assert.deepEqual(_literal.meta, {
      jsType: '1',
      db: { type: 'TEXT' },
      literal: 1,
    });

    assert.equal(_literal.safeParse(1), 1);

    assertSchemaIssue(_literal, 'required', ''); // Por ser required e como string vazia é null, então não é nullable
    assertSchemaIssue(_literal, 'not_literal_equal', 2);
  });

  //
  //

  test('Deve executar parse do distinct com sucesso', () => {
    const obj1 = object({
      id: literal(1),
      name: literal('name1'),
    });

    const obj2 = object({
      id: literal(2),
      name: literal('name2'),
    });

    const _distinct = distinct('id', [obj1, obj2]);

    assert.equal(
      _distinct.meta.jsType,
      '({"id":1;"name":"name1"})|({"id":2;"name":"name2"})',
    );

    assert.deepEqual(_distinct.safeParse({ id: 1, name: 'name1' }), {
      id: 1,
      name: 'name1',
    });

    assert.deepEqual(_distinct.safeParse({ id: 2, name: 'name2' }), {
      id: 2,
      name: 'name2',
    });

    const issue = _distinct.safeParse({ id: 2, name: 'something' }) as Issue;

    assert.equal(issue.code, 'object_shape');
  });
});
