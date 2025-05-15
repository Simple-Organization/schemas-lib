import { test, expect } from 'bun:test';
import { union } from './union';
import { int } from './int';
import { string } from './string';
import { errorTesting } from '../utils/error';

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

  errorTesting('not_number_type', schema, {});
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

test('Deve retornar o primeiro sucesso', () => {
  const schema = union([int(), string()]).optional();

  expect(schema.safeParse(2)).toEqual({ success: true, data: 2 });
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

  errorTesting('not_number_type', schema, {});
});
