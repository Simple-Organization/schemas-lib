import { test, expect } from 'bun:test';
import { nome } from './nameField';
import { SchemaLibError } from '../SchemaLibError';
import { errorTesting } from '../utils/error';

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

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
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
