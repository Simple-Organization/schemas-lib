import { test, expect } from 'bun:test';
import { object2 as object, strict2 as strict } from './object2';
import { id2 as id, int2 as int } from './int2';
import { SchemaLibError } from '../SchemaLibError';
import { float2 as float, number2 as number } from './float2';

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
    data: { a: 1, b: null },
  });

  expect(schema.safeParse({})).toEqual({
    success: false,
    error: new SchemaLibError('required', schema, {}), // Não importa muito agora, pois vai mudar
  });

  expect(schema.safeParse('{"a":1,"b":2}')).toEqual({
    success: true,
    data: { a: 1, b: 2 },
  });

  expect(schema.safeParse('')).toEqual({
    success: false,
    error: new SchemaLibError('required', schema, ''),
  });

  expect(schema.safeParse(undefined)).toEqual({
    success: false,
    error: new SchemaLibError('required', schema, undefined),
  });

  expect(schema.safeParse(null)).toEqual({
    success: false,
    error: new SchemaLibError('required', schema, null),
  });

  expect(schema.safeParse(123)).toEqual({
    success: false,
    error: new SchemaLibError('not_object', schema, 123),
  });
});

test('Deve ser opcional com sucesso', () => {
  const schema = object({
    a: int().optional(),
  }).optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
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

  expect(schema.safeParse({ a: 1, b: 2 })).toEqual({
    success: false,
    error: new SchemaLibError('object_extra_keys', schema, { a: 1, b: 2 }),
  });
});

test('Deve retornar erro para JSON inválido', () => {
  const schema = object({ a: int() });

  expect(schema.safeParse('{a:1}')).toEqual({
    success: false,
    error: new SchemaLibError('not_valid_json', schema, '{a:1}'),
  });
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
