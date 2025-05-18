import { test, expect } from 'bun:test';
import { Schema } from './Schema';

//
//

class TestSchema extends Schema<string> {
  process(): void {}
}

//
//

test('Deve transformar o valor com sucesso', () => {
  const schema = new TestSchema().transform((value) => {
    return value + '1';
  });

  expect(schema.safeParse('2')).toEqual({ success: true, data: '21' });
  expect(schema.safeParse('aaaa')).toEqual({ success: true, data: 'aaaa1' });
});

//
//

test('Se parse for definido com um valor empty, deve retornar com esse valor', () => {
  const schema = new TestSchema().optional();

  // Undefined
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: undefined,
  });
  expect(schema.safeParse(null)).toEqual({ success: true, data: undefined });
  expect(schema.safeParse('')).toEqual({ success: true, data: undefined });

  //
  // null
  expect(schema.safeParse(undefined, null)).toEqual({
    success: true,
    data: null,
  });
  expect(schema.safeParse(null, null)).toEqual({
    success: true,
    data: null,
  });
  expect(schema.safeParse('', null)).toEqual({
    success: true,
    data: null,
  });

  //
  // empty string
  expect(schema.safeParse(undefined, '')).toEqual({
    success: true,
    data: '',
  });
  expect(schema.safeParse(null, '')).toEqual({
    success: true,
    data: '',
  });
  expect(schema.safeParse('', '')).toEqual({
    success: true,
    data: '',
  });
});
