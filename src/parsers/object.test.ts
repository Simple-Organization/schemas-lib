import { test, expect } from 'bun:test';
import { object, strict } from './object';
import { id, int } from './int';
import { float, number } from './float';
import { errorTesting } from '../utils/error';
import { array } from './array';

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

//
//

test('Deve retornar erro para JSON inválido', () => {
  const schema = object({ a: int() });

  errorTesting('not_valid_json', schema, '{a:1}');
});

//
//

test('Se o valor empty do parse for undefined, deve remover a propriedade', () => {
  const schema = object({
    a: int(),
    b: int().optional(),
  });

  const parsed = schema.safeParse({ a: 1, b: null });

  expect(parsed).toEqual({
    success: true,
    data: { a: 1 },
  });

  expect('b' in (parsed as any).data).toBe(false);
});

//
//

test("Se o valor empty do parse for null ou '', deve incluir a propriedade", () => {
  const schema = object({
    a: int(),
    b: int().optional(),
  });

  const parsed1 = schema.safeParse({ a: 1, b: null }, null);

  expect(parsed1).toEqual({
    success: true,
    data: { a: 1, b: null },
  });

  const parsed2 = schema.safeParse({ a: 1, b: null }, '');

  expect(parsed2).toEqual({
    success: true,
    data: { a: 1, b: '' as any },
  });
});

//
//

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

//
//

test('Os valores default de uma propriedade devem ser aplicadas', () => {
  const schema = object({
    a: int().default(1),
  });

  const parsed = schema.safeParse({});

  expect(parsed).toEqual({
    success: true,
    data: { a: 1 },
  });
});

//
//

test('Os valores default de uma propriedade devem ser aplicada 2', () => {
  const google_maps_query_schema = object({
    lat: number().default(-23.6594002),
    lng: number().default(-46.4473205),
    zoom: number().default(15),
  });

  const parsed = google_maps_query_schema.parse({});

  expect(parsed).toEqual({
    lat: -23.6594002,
    lng: -46.4473205,
    zoom: 15,
  });
});

//
//

test('Um objeto com um array como string deve ter seu valor modificado corretamente', () => {
  const google_maps_query_schema = object({
    ids: array(int()).default([]),
  });

  const parsed = google_maps_query_schema.parse('{ "ids": "[1,2,3]" }');

  expect(parsed).toEqual({
    ids: [1, 2, 3],
  });
});
