import { describe, test } from 'mocha';
import { assert } from 'chai';
import {
  Issue,
  array,
  enumType,
  int,
  object,
  strict,
  trimmed,
} from '../../src';
import { assertSchemaIssue } from '../util';

describe('object schema', () => {
  //
  //

  test('Deve ter gerado a tipagem com sucesso', () => {
    const obj1 = object({ id: int });
    assert.equal(obj1.meta.jsType, '{"id":number}');

    const obj2 = object({ id: int, name: trimmed.nullish() });
    assert.equal(obj2.meta.jsType, '{"id":number;"name"?:string|null}');

    const obj3 = object({
      ids: array(int).optional(),
      name: trimmed.nullable(),
    });
    assert.equal(obj3.meta.jsType, '{"ids"?:(number)[];"name":string|null}');

    const obj4 = object({ ids: enumType(['int', 'other']).optional() });
    assert.equal(obj4.meta.jsType, "{\"ids\"?:'int'|'other'}");
  });

  //
  //

  test('Deve executar criar o shape com sucesso', () => {
    const obj = object({ id: int });

    assert.equal(obj.shape.id.meta.name, 'id');
    assert.equal(int.meta.name, undefined);
    assert.notEqual(obj.shape.id, int);

    assert.deepEqual(Object.keys(obj.shape), ['id']);

    assert.equal(
      obj.safeParse({}).toString(),
      '{"id":"O campo é obrigatório"}',
    );
  });

  //
  //

  test('Deve executar o safeParse com sucesso', () => {
    const objSchema = object({ id: int });

    assert.deepEqual(objSchema.safeParse({ id: 1 }), { id: 1 });
    assert.deepEqual(objSchema.safeParse({ id: '1' }), { id: 1 });
    assert.deepEqual(objSchema.safeParse('{ "id": 1 }'), { id: 1 });
    assert.deepEqual(objSchema.safeParse('{ "id": "1" }'), { id: 1 });

    assertSchemaIssue(objSchema, 'not_valid_json', 'asdf');
    assertSchemaIssue(objSchema, 'not_object', 1);

    // Optional tests
    assertSchemaIssue(objSchema, 'required', undefined);
    assertSchemaIssue(objSchema, 'required', null);
    assertSchemaIssue(objSchema, 'required', '');
  });

  //
  //

  test('Não deve manter variáveis adicionais', () => {
    const objSchema = object({ id: int });

    assert.deepEqual(objSchema.safeParse({ id: 1, a: 'something' }), {
      id: 1,
    } as any);
  });

  //
  //

  test('Deve recursivamente dar safeParse', () => {
    const objSchema1 = object({
      a: object({
        b: int,
      }),
    });

    assert.deepEqual(
      objSchema1.safeParse({
        a: '{ "b": 1 }',
      }),
      {
        a: {
          b: 1,
        },
      },
    );

    const objSchema2 = object({
      a: object({
        b: object({
          c: int,
        }),
      }),
    });

    assert.deepEqual(
      objSchema2.safeParse({
        a: {
          b: {
            c: 1,
          },
        },
      }),
      {
        a: {
          b: {
            c: 1,
          },
        },
      },
    );

    assert.deepEqual(
      objSchema2.safeParse({
        a: {
          b: '{ "c": 1 }',
        },
      }),
      {
        a: {
          b: {
            c: 1,
          },
        },
      },
    );
  });

  //
  //

  test('Deve testar o strict() e ter funcionalidades similares ao object()', () => {
    const objSchema = strict({ id: int });

    assert.deepEqual(objSchema.safeParse({ id: 1 }), { id: 1 });
    assert.deepEqual(objSchema.safeParse({ id: '1' }), { id: 1 });
    assert.deepEqual(objSchema.safeParse('{ "id": 1 }'), { id: 1 });
    assert.deepEqual(objSchema.safeParse('{ "id": "1" }'), { id: 1 });

    assertSchemaIssue(objSchema, 'object_extra_keys', {
      id: 1,
      a: 'something',
    });
    assertSchemaIssue(objSchema, 'object_extra_keys', { a: 'something' });

    // @ts-ignore
    assert.deepEqual(objSchema.safeParse({})?.serialize(), {
      id: 'O campo é obrigatório',
    });

    assertSchemaIssue(objSchema, 'not_valid_json', 'asdf');
    assertSchemaIssue(objSchema, 'not_object', 1);

    // Optional tests
    assertSchemaIssue(objSchema, 'required', undefined);
    assertSchemaIssue(objSchema, 'required', null);
    assertSchemaIssue(objSchema, 'required', '');
  });

  //
  //

  test('Não deve adicionar campos undefined', () => {
    const objSchema = object({ id: int.optional() });

    assert.deepEqual(objSchema.safeParse({ id: 1 }), {
      id: 1,
    });

    assert.deepEqual(objSchema.safeParse({}), {});
  });

  //
  //

  test('omit() deve funcionar com sucesso', () => {
    const objSchema = object({ id: int, name: trimmed });

    const result: Issue = objSchema.safeParse({ id: 1 }) as unknown as Issue;

    assert.equal(result.code, 'object_shape');

    const objSchema2 = objSchema.omit({ name: true });

    assert.deepEqual(objSchema2.safeParse({ id: 1 }), { id: 1 });
  });

  //
  //

  test('pick() deve funcionar com sucesso', () => {
    const objSchema = object({ id: int, name: trimmed });

    const result: Issue = objSchema.safeParse({ id: 1 }) as unknown as Issue;

    assert.equal(result.code, 'object_shape');

    const objSchema2 = objSchema.pick({ id: true });

    assert.deepEqual(objSchema2.safeParse({ id: 1 }), { id: 1 });
  });

  //
  //

  test('Se o objeto for um json, deve dar parse', () => {
    const obj = object({ id: int });
    assert.deepEqual(obj.parse('{ "id": 1 }'), { id: 1 } as any);
  });

  //
  //

  test('Se clonar um object(), a instancia de .shape deve ser diferente e não afetar a instancia do original', () => {
    const obj = object({ id: int });

    const obj2 = obj.clone();

    assert.notEqual(obj.shape, obj2.shape);

    // @ts-ignore
    obj2.shape.name = trimmed;

    // @ts-ignore
    assert.equal(!!obj.shape.name, false);
  });

  //
  //

  test('Se um campo retornar default() como undefined, o objeto deve remover a propriedade', () => {
    const objSchema = object({ id: int.default() });

    assert.deepEqual(objSchema.safeParse({ id: 1 }), {
      id: 1,
    });

    assert.deepEqual(objSchema.safeParse({}), {});
  });
});
