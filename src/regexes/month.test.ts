import { test, expect } from 'bun:test';
import { month } from './month';
import { SchemaLibError } from '../SchemaLibError';

test('Deve executar o safeParse com sucesso', () => {
  const schema = month();

  expect(schema.safeParse('2024-05')).toEqual({
    success: true,
    data: '2024-05',
  });

  expect(schema.safeParse('2024-13')).toEqual({
    success: false,
    error: new SchemaLibError('not_month', schema, '2024-13'),
  });

  expect(schema.safeParse('2024-5')).toEqual({
    success: false,
    error: new SchemaLibError('not_month', schema, '2024-5'),
  });

  expect(schema.safeParse('2024-64')).toEqual({
    success: false,
    error: new SchemaLibError('not_month', schema, '2024-64'),
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
    error: new SchemaLibError('not_string', schema, obj),
  });
});

test('Deve ser opcional com sucesso', () => {
  const schema = month().optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('2024-05')).toEqual({
    success: true,
    data: '2024-05',
  });
});

test('Deve ter default com sucesso', () => {
  const schema = month().default(() => '2024-01');

  expect(schema.safeParse('')).toEqual({ success: true, data: '2024-01' });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: '2024-01',
  });
  expect(schema.safeParse(null)).toEqual({ success: true, data: '2024-01' });
  expect(schema.safeParse('2024-05')).toEqual({
    success: true,
    data: '2024-05',
  });
});
