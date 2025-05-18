import { test, expect } from 'bun:test';
import { object, strict } from './object';
import { id, int } from './int';
import { float, number } from './float';
import { errorTesting } from '../utils/error';

test('Deve executar o safeParse com sucesso', () => {
  const schema = object({
    a: int(),
    b: int().optional(),
  });

  expect(schema.safeParse({ a: 1, b: 2 })).toEqual({
    success: true,
    data: { a: 1, b: 2 },
  });

  expect(schema.safeParse({ a: 1 })).toEqual({
    success: true,
    data: { a: 1, b: undefined },
  });

  errorTesting('required', schema, {});

  expect(schema.safeParse('{"a":1,"b":2}')).toEqual({
    success: true,
    data: { a: 1, b: 2 },
  });

  errorTesting('required', schema, '');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);

  errorTesting('not_object', schema, 123);
});

test('Deve ser opcional com sucesso', () => {
  const schema = object({
    a: int().optional(),
  }).optional();

  const success: any = { success: true };

  expect(schema.safeParse('')).toEqual(success);
  expect(schema.safeParse(undefined)).toEqual(success);
  expect(schema.safeParse(null)).toEqual(success);
  expect(schema.safeParse({ a: 1 })).toEqual({ success: true, data: { a: 1 } });
});

test('Deve ter default com sucesso', () => {
  const schema = object({
    a: int(),
  }).default(() => ({ a: 42 }));

  expect(schema.safeParse('')).toEqual({ success: true, data: { a: 42 } });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: { a: 42 },
  });
  expect(schema.safeParse(null)).toEqual({ success: true, data: { a: 42 } });
  expect(schema.safeParse({ a: 1 })).toEqual({ success: true, data: { a: 1 } });
});

test('Deve validar modo estrito', () => {
  const schema = strict({
    a: int(),
  });

  expect(schema.safeParse({ a: 1 })).toEqual({
    success: true,
    data: { a: 1 },
  });

  errorTesting('object_extra_keys', schema, { a: 1, b: 2 });
});

test('Deve retornar erro para JSON inválido', () => {
  const schema = object({ a: int() });

  errorTesting('not_valid_json', schema, '{a:1}');
});

test('Deve fazer parse de um objeto complexo', () => {
  const schema = object({
    a: int(),
    b: float(),
    c: number(),
    d: id(),
    e: object({ f: object({ g: id() }) }),
  });

  expect(
    schema.safeParse({
      a: 1,
      b: 2.5,
      c: 3,
      d: 4,
      e: {
        f: {
          g: 5,
        },
      },
    }),
  ).toEqual({
    success: true,
    data: {
      a: 1,
      b: 2.5,
      c: 3,
      d: 4,
      e: {
        f: {
          g: 5,
        },
      },
    },
  });
});
