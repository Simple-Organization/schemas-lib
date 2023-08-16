import { describe, test } from 'mocha';
import { assert } from 'chai';
import { assertSchemaIssue } from '../util';
import { intString, string, trimmed, url } from '../../src';

describe('string schema', () => {
  //
  //

  test('Deve checar se é uma string com required', () => {
    assert.deepEqual(string.meta, {
      jsType: 'string',
      db: { type: 'TEXT' },
    });

    assert.equal(string.safeParse('a'), 'a');

    assertSchemaIssue(string, 'required', ''); // Por ser required e como string vazia é null, então não é nullable
    assertSchemaIssue(string, 'not_string_type', 0);
    assertSchemaIssue(string, 'not_string_type', new Map());
    assertSchemaIssue(string, 'not_string_type', new Date());
  });

  //
  //

  test('Deve checar se é uma string com nullish', () => {
    const nullishString = string.nullish();

    assert.deepEqual(nullishString.meta, {
      jsType: 'string',
      db: { type: 'TEXT' },
      mode: 'nullish',
    });

    assert.equal(nullishString.safeParse('a'), 'a');
    assert.equal(nullishString.safeParse(''), null); // Por ser nullish

    assertSchemaIssue(nullishString, 'not_string_type', 0);
    assertSchemaIssue(nullishString, 'not_string_type', new Map());
    assertSchemaIssue(nullishString, 'not_string_type', new Date());
  });

  //
  //

  test('Deve checar se a string tem cumprimento específico', () => {
    const stringMin2 = string.min(2);
    const stringMax2 = string.max(2);

    assert.deepEqual(stringMin2.meta, {
      jsType: 'string',
      db: { type: 'TEXT' },
      min: 2,
    });

    assert.deepEqual(stringMax2.meta, {
      jsType: 'string',
      db: { type: 'TEXT' },
      max: 2,
    });

    assertSchemaIssue(stringMin2, 'min_length', '0');
    assertSchemaIssue(stringMax2, 'max_length', 'asdf');
  });
});

//
//

describe('text schema', () => {
  //
  //

  test('Deve checar se text é uma string com required', () => {
    assert.deepEqual(trimmed.meta, {
      jsType: 'string',
      db: { type: 'TEXT' },
    });

    assert.equal(trimmed.safeParse('   a   '), 'a');

    assertSchemaIssue(trimmed, 'required', '          '); // Por ser required e como string vazia é null, então não é nullable
    assertSchemaIssue(trimmed, 'not_string_type', 0);
    assertSchemaIssue(trimmed, 'not_string_type', new Map());
    assertSchemaIssue(trimmed, 'not_string_type', new Date());
  });

  //
  //

  test('Deve checar se é uma string com nullish', () => {
    const nullishText = trimmed.nullish();

    assert.deepEqual(nullishText.meta, {
      jsType: 'string',
      db: { type: 'TEXT' },
      mode: 'nullish',
    });

    assert.equal(trimmed.safeParse('a'), 'a');
    assert.equal(nullishText.safeParse('  a   '), 'a');
    assert.equal(nullishText.safeParse('        '), null); // Por ser nullish

    assertSchemaIssue(nullishText, 'not_string_type', 0);
    assertSchemaIssue(nullishText, 'not_string_type', new Map());
    assertSchemaIssue(nullishText, 'not_string_type', new Date());
  });

  //
  //

  test('Deve checar se a string tem cumprimento específico', () => {
    const textMin2 = trimmed.min(2);
    const textMax2 = trimmed.max(2);
    const textBetween_2_and_4 = trimmed.between(2, 4);

    assertSchemaIssue(textMin2, 'min_length', '0');
    assertSchemaIssue(textMin2, 'min_length', '  0  ');
    assertSchemaIssue(textMax2, 'max_length', 'asdf');

    assert.equal(textBetween_2_and_4.safeParse('  aa  '), 'aa');
    assert.equal(textBetween_2_and_4.safeParse('  aaaa  '), 'aaaa');
    assertSchemaIssue(textBetween_2_and_4, 'min_length', '   0   ');
    assertSchemaIssue(textBetween_2_and_4, 'max_length', 'asdfg');
  });

  //
  //

  test('Deve checar se a string é uma URL válida', () => {
    assert.equal(
      url.safeParse('http://localhost:3000'),
      'http://localhost:3000',
    );
    assert.equal(url.safeParse('localhost:3000'), 'http://localhost:3000');
    assert.equal(
      url.safeParse('localhost:3000?a=1'),
      'http://localhost:3000?a=1',
    );
    assert.equal(
      url.safeParse('localhost:3000?a=1#a'),
      'http://localhost:3000?a=1#a',
    );
    assert.equal(
      url.safeParse('localhost:3000/a?a=1#a'),
      'http://localhost:3000/a?a=1#a',
    );
    assert.equal(
      url.safeParse('arrroz_asdasdsadasd_asd'),
      'http://arrroz_asdasdsadasd_asd',
    );
  });

  //
  //

  test('Deve checar se a string é um int válido', () => {
    const textIntBetween8 = intString.between(2, 8);

    assert.equal(intString.safeParse('   1   '), '1');
    assert.equal(intString.safeParse('123'), '123');

    assert.equal(textIntBetween8.safeParse('   12345678   '), '12345678');
    assert.equal(textIntBetween8.safeParse('12345678'), '12345678');

    assertSchemaIssue(intString, 'not_integer', 'a');
    assertSchemaIssue(textIntBetween8, 'min_length', '1');
  });
});
