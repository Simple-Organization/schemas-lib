import { describe, test } from 'mocha';
import { assert } from 'chai';
import {
  Schema,
  type SchemaParser,
  Issue,
  int,
  NumberSchema,
  SchemaMeta,
} from '../src';
import { assertSchemaIssue } from './util';

describe('Schema', () => {
  const noopParsers: SchemaParser[] = [(value) => value];

  //
  //

  test('Deve clonar o schema com sucesso', () => {
    const schema = new Schema(noopParsers);

    const clone = schema.clone();

    assert.deepEqual(clone, schema);
    assert.notEqual(clone, schema);

    assert.deepEqual(clone.meta, schema.meta);
    assert.notEqual(clone.meta, schema.meta);

    assert.deepEqual(clone.parsers, schema.parsers);
    assert.notEqual(clone.parsers, schema.parsers);
  });

  //
  //

  test('Deve mudar o modo do schema com sucesso', () => {
    const schema = new Schema(noopParsers, { jsType: 'string' });

    const optional = schema.optional();
    const nullable = schema.nullable();
    const nullish = schema.nullish();
    const required = schema.required();

    assert.deepEqual(
      optional,
      new Schema(noopParsers, {
        jsType: 'string',
        mode: 'optional',
      }),
    );

    assert.deepEqual(
      nullable,
      new Schema(noopParsers, {
        jsType: 'string',
        mode: 'nullable',
      }),
    );

    assert.deepEqual(
      nullish,
      new Schema(noopParsers, {
        jsType: 'string',
        mode: 'nullish',
      }),
    );

    assert.deepEqual(
      required,
      new Schema(noopParsers, {
        jsType: 'string',
        mode: 'required',
      }),
    );
  });

  //
  //

  test('Deve validar optional com sucesso', () => {
    const schema = new Schema<string>(noopParsers);

    const optional = schema.optional();

    assert.deepEqual(optional.safeParse(undefined), undefined);

    assert.deepEqual(
      optional.safeParse(null),
      new Issue('not_nullable', optional.meta, null),
    );

    assert.deepEqual(
      optional.safeParse(''),
      new Issue('not_nullable', optional.meta, ''),
    );
  });

  //
  //

  test('Deve validar nullable com sucesso', () => {
    const schema = new Schema(noopParsers);

    const nullable = schema.nullable();

    assert.deepEqual(nullable.safeParse(null), null);

    assert.deepEqual(
      nullable.safeParse(undefined),
      new Issue('not_optional', nullable.meta, undefined),
    );

    assert.deepEqual(nullable.safeParse(''), null);
  });

  //
  //

  test('Deve validar nullish com sucesso', () => {
    const schema = new Schema(noopParsers);

    const nullish = schema.nullish();

    assert.deepEqual(nullish.safeParse(null), null);
    assert.deepEqual(nullish.safeParse(undefined), undefined);
    assert.deepEqual(nullish.safeParse(''), null);
  });

  //
  //

  test('Deve definir valor default com sucesso', () => {
    const schema = new Schema(noopParsers);

    schema.meta.default = () => 'default';

    //
    // nullish tests

    const nullish = schema.nullish();

    assert.deepEqual(nullish.safeParse(null), 'default');
    assert.deepEqual(nullish.safeParse(undefined), 'default');
    assert.deepEqual(nullish.safeParse(''), 'default');

    //
    // nullable tests

    const nullable = schema.nullable();

    assert.deepEqual(nullable.safeParse(null), 'default');
    assert.deepEqual(
      nullable.safeParse(undefined),
      new Issue('not_optional', nullable.meta, undefined),
    );
    assert.deepEqual(nullable.safeParse(''), 'default');

    //
    // optional tests

    const optional = schema.optional();

    assert.deepEqual(
      optional.safeParse(null),
      new Issue('not_nullable', optional.meta, null),
    );
    assert.deepEqual(optional.safeParse(undefined), 'default');
    assert.deepEqual(optional.safeParse(''), 'default');

    //
    // required 1 tests

    const required1 = schema;

    assert.deepEqual(
      required1.safeParse(null),
      new Issue('required', required1.meta, null),
    );
    assert.deepEqual(
      required1.safeParse(undefined),
      new Issue('required', required1.meta, undefined),
    );
    assert.deepEqual(
      required1.safeParse(null),
      new Issue('required', required1.meta, null),
    );

    //
    // required 2 tests

    const required2 = schema.required();

    assert.deepEqual(
      required2.safeParse(null),
      new Issue('required', required2.meta, null),
    );
    assert.deepEqual(
      required2.safeParse(undefined),
      new Issue('required', required2.meta, undefined),
    );
    assert.deepEqual(
      required2.safeParse(null),
      new Issue('required', required2.meta, null),
    );
  });

  //
  //

  test('Valor default deve definir o campo como nullish', () => {
    const schema = new Schema(noopParsers);
    const defal = schema.default(true);

    assert.equal(defal.meta.mode, 'nullish');
  });

  //
  //

  test('Deve adicionar o info com sucesso', () => {
    const schema = new Schema<string>(noopParsers);

    const withInfo = schema.info({
      label: 'Test',
      description: 'Test description',
    });

    assert.deepEqual(withInfo.meta, {
      label: 'Test',
      description: 'Test description',
    });
  });

  //
  //

  test('Deve revalidar o default com sucesso (_sendDefault)', () => {
    const schema1 = int.default('1' as any);
    const schema2 = int.default(null as any);

    assert.equal(schema1.safeParse(null), 1);

    const instance = (schema1 as any)._defaultReq.constructor;
    assert.equal(instance, NumberSchema);

    assert.throw(() => {
      schema2.parse(null);
    });
  });

  //
  //

  test('Deve exibir erro customizado adequadamente', () => {
    const schema1 = int.errors({ not_number_string: 'Custom error' });

    assert.equal(schema1.safeParse('-asdas').toString(), 'Custom error');

    assert.equal(
      schema1.safeParse(1.2).toString(),
      'O campo não é um número inteiro',
    );
  });

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
        return new Issue('any', meta, originalValue);
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

    // should return a issue when it is safeParse
    assertSchemaIssue(catched, 'any', 'any');
  });
});
