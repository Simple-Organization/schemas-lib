import { describe, test } from 'mocha';
import { assert } from 'chai';
import { Issue, int, trimmed } from '../../src';
import { assertSchemaIssue } from '../util';
import { mixin } from '../../src/parsers/mixin';

describe('mixin schema', () => {
  //
  //

  test('Deve executar parse do mixin com sucesso', () => {
    const metaEnum = mixin([int(), trimmed()]);

    // const a: Infer<typeof metaEnum> = null as any;

    assert.deepEqual(metaEnum.meta, {
      jsType: '(number) | (string)',
      mixin: [int(), trimmed()],
    });

    assert.equal(metaEnum.safeParse('1'), 1 as any);
    assert.equal(metaEnum.safeParse('  abc  '), 'abc' as any);
    assert.equal(metaEnum.safeParse('c'), 'c' as any);

    assertSchemaIssue(metaEnum, 'required', ''); // Por ser required e como string vazia é null, então não é nullable

    const issue: Issue = metaEnum.safeParse(new Set()) as any;
    assert.equal(issue.code, 'not_number_type');
  });
});
