import { test, expect } from 'bun:test';
import { errorTesting } from '../utils/error';
import { nome } from './nome';

test('Deve executar o safeParse com sucesso', () => {
  const schema = nome();

  expect(schema.safeParse('João')).toEqual({
    success: true,
    data: 'João',
  });

  expect(schema.safeParse('Ana Maria')).toEqual({
    success: true,
    data: 'Ana Maria',
  });

  errorTesting('not_name', schema, 'A');

  errorTesting('required', schema, '');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);

  const obj = {};
  errorTesting('not_string_type', schema, obj);
});

test('Deve ser opcional com sucesso', () => {
  const schema = nome().optional();

  const success: any = { success: true };

  expect(schema.safeParse('')).toEqual(success);
  expect(schema.safeParse(undefined)).toEqual(success);
  expect(schema.safeParse(null)).toEqual(success);
  expect(schema.safeParse('João')).toEqual({
    success: true,
    data: 'João',
  });
});

test('Deve ter default com sucesso', () => {
  const schema = nome().default(() => 'João');

  expect(schema.safeParse('')).toEqual({
    success: true,
    data: 'João',
  });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: 'João',
  });
  expect(schema.safeParse(null)).toEqual({
    success: true,
    data: 'João',
  });
  expect(schema.safeParse('João')).toEqual({
    success: true,
    data: 'João',
  });
});
