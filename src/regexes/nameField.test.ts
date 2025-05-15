import { test, expect } from 'bun:test';
import { nome } from './nameField';
import { SchemaLibError } from '../SchemaLibError';

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

  expect(schema.safeParse('A')).toEqual({
    success: false,
    error: new SchemaLibError('not_name', schema, 'A'),
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

  const obj = {};
  expect(schema.safeParse(obj)).toEqual({
    success: false,
    error: new SchemaLibError('not_string_type', schema, obj),
  });
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
