import { test, expect } from 'bun:test';
import { union } from './union';
import { int } from './int';
import { SchemaLibError } from '../SchemaLibError';
import { NewSchema } from '../schemas/NewSchema';
import { string } from './string';

//
//

test('Deve executar o safeParse com sucesso', () => {
  const schema = union([int(), string()]);

  expect(schema.safeParse(1)).toEqual({
    success: true,
    data: 1,
  });

  expect(schema.safeParse('1')).toEqual({
    success: true,
    data: 1,
  });

  expect(schema.safeParse('abc')).toEqual({
    success: true,
    data: 'abc',
  });

  expect(schema.safeParse({})).toEqual({
    success: false,
    error: new SchemaLibError('union_no_match', schema, {}),
  });
});

//
//

test('Deve ser opcional com sucesso', () => {
  const schema = union([int(), string()]).optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse(2)).toEqual({ success: true, data: 2 });
  expect(schema.safeParse('abc')).toEqual({ success: true, data: 'abc' });
});

//
//

test('Deve ter default com sucesso', () => {
  const schema = union([int(), string()]).default(() => 'default');

  expect(schema.safeParse('')).toEqual({ success: true, data: 'default' });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: 'default',
  });
  expect(schema.safeParse(null)).toEqual({ success: true, data: 'default' });
  expect(schema.safeParse(3)).toEqual({ success: true, data: 3 });
  expect(schema.safeParse('abc')).toEqual({ success: true, data: 'abc' });
});

//
//

test('Deve retornar erro se nenhum schema casar', () => {
  const schema = union([int(), string()]);

  expect(schema.safeParse({})).toEqual({
    success: false,
    error: new SchemaLibError('union_no_match', schema, {}),
  });
});
