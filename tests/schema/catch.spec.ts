import { describe, test } from 'mocha';
import { assert } from 'chai';
import {
  Schema,
  Issue,
  int,
  SchemaMeta,
  CustomIssue,
  trimmed,
  object,
  id,
} from '../../src';

describe('Schema.catch', () => {
  //
  //

  test('catch precisa retornar o valor padrão caso dê um Issue', () => {
    const schema = new Schema([parser]);

    //
    // parser that when receives 'any' returns an Issue

    function parser(
      value: any,
      meta: SchemaMeta,
      originalValue: any,
    ): Issue | number {
      if (value === 'any') {
        return new CustomIssue('any error', meta, originalValue);
      }
      return value;
    }

    //
    //

    const catched = schema.catch('catched');

    // should return the value when it's not 'any'
    assert.deepEqual(catched.parse('asdf'), 'asdf');

    // should return catched when it's 'any'
    assert.deepEqual(catched.parse('any'), 'catched');

    // should return catched when used safeParse
    assert.deepEqual(catched.safeParse('any'), 'catched');
  });

  //
  //

  test('catch sem argumento e required não deve dar erro, deve ao invés retornar undefined', () => {
    const schema = new Schema([parser]);

    //
    // parser that when receives 'any' returns an Issue

    function parser(
      value: any,
      meta: SchemaMeta,
      originalValue: any,
    ): Issue | number {
      if (value === 'any') {
        return new CustomIssue('any error', meta, originalValue);
      }
      return value;
    }

    //
    //

    const catched = schema.catch();

    assert.deepEqual(catched.parse(undefined), undefined);
    assert.deepEqual(catched.parse('asdf'), 'asdf');
    assert.deepEqual(catched.parse('any'), undefined);
  });

  //
  //

  test('catch int deve funcionar corretamente', () => {
    const intCatch = int().catch();

    //
    //

    const catched = intCatch.catch();

    assert.deepEqual(catched.parse(undefined), undefined);
    assert.deepEqual(catched.parse('asdf'), undefined);
    assert.deepEqual(catched.parse(['any']), undefined);
    assert.deepEqual(catched.parse(1), 1);
  });

  //
  //

  test('catch int deve funcionar corretamente', () => {
    const intCatch = int().catch();

    //
    //

    const catched = intCatch.catch();

    assert.deepEqual(catched.parse(undefined), undefined);
    assert.deepEqual(catched.parse('asdf'), undefined);
    assert.deepEqual(catched.parse(['any']), undefined);
    assert.deepEqual(catched.parse(1), 1);
  });

  //
  //

  test('catch com object deve funcionar corretamente', () => {
    const querySchema = object({
      search: trimmed().catch(),
      id: id().catch(),
    });

    //
    //

    assert.deepEqual(querySchema.parse({}), {});

    //

    assert.deepEqual(querySchema.parse({ search: 'aaaa', id: 1 }), {
      search: 'aaaa',
      id: 1,
    });

    //

    assert.deepEqual(querySchema.parse({ id: 'arroz' }), {});

    //

    assert.deepEqual(querySchema.parse({ search: 'aaaa', id: 'aaa' }), {
      search: 'aaaa',
    });
  });

  //
  //

  test('aaaaaaaaaaaaaaa', () => {
    const querySchema = object({
      search: trimmed().catch(),
      id: id().catch(),
    });

    assert.deepEqual(querySchema.parse({ id: 'arroz' }), {});
  });
});
