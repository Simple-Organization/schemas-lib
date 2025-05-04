import { test, expect } from 'bun:test';
import { literal } from './literal';
import { SchemaLibError } from '../SchemaLibError';

test('Deve executar o safeParse com sucesso', () => {
  const schema = literal('abc');

  expect(schema.safeParse('abc')).toEqual({
    success: true,
    data: 'abc',
  });

  expect(schema.safeParse('def')).toEqual({
    success: false,
    error: new SchemaLibError('not_literal_equal', schema, 'def'),
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
});

test('Deve ser opcional com sucesso', () => {
  const schema = literal(123).optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse(123)).toEqual({ success: true, data: 123 });
});

test('Deve ter default com sucesso', () => {
  const schema = literal(true).default(() => true);

  expect(schema.safeParse('')).toEqual({ success: true, data: true });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: true });
  expect(schema.safeParse(null)).toEqual({ success: true, data: true });
  expect(schema.safeParse(true)).toEqual({ success: true, data: true });
});
