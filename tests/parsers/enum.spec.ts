import { describe, test } from 'mocha';
import { assert } from 'chai';
import { enumType } from '../../src';
import { assertSchemaIssue } from '../util';

describe('enum schema', () => {
  //
  //

  test('Deve executar parse do enum com sucesso', () => {
    const metaEnum = enumType(['a', 'b', 'c']);

    assert.deepEqual(metaEnum.meta, {
      jsType: "'a'|'b'|'c'",
      enum: ['a', 'b', 'c'],
    });

    assert.equal(metaEnum.safeParse('a'), 'a' as any);
    assert.equal(metaEnum.safeParse('b'), 'b' as any);
    assert.equal(metaEnum.safeParse('c'), 'c' as any);

    assertSchemaIssue(metaEnum, 'required', ''); // Por ser required e como string vazia é null, então não é nullable
    assertSchemaIssue(metaEnum, 'not_string_type', 0);
    assertSchemaIssue(metaEnum, 'not_enum', '0');
  });
});
