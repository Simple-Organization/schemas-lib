import { test, expect } from 'bun:test';
import { date } from './date';
import { SchemaLibError } from '../SchemaLibError';

//
//
test.only('Deve executar o safeParse com sucesso', () => {
  const schema = date();

  expect(schema.safeParse('2024-05-04')).toEqual({
    success: true,
    data: '2024-05-04',
  });

  expect(schema.safeParse('2024-02-29')).toEqual({
    success: true,
    data: '2024-02-29',
  });

  expect(schema.safeParse('2024-02-30')).toEqual({
    success: false,
    error: new SchemaLibError('not_date', schema, '2024-02-30'),
  });

  expect(schema.safeParse('2024-02-64')).toEqual({
    success: false,
    error: new SchemaLibError('not_date', schema, '2024-02-64'),
  });

  expect(schema.safeParse('2024-5-4')).toEqual({
    success: false,
    error: new SchemaLibError('not_date', schema, '2024-5-4'),
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

//
//
test('Deve ser opcional com sucesso', () => {
  const schema = date().optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('2024-05-04')).toEqual({
    success: true,
    data: '2024-05-04',
  });
});

//
//
test('Deve ter default com sucesso', () => {
  const schema = date().default(() => '2024-01-01');

  expect(schema.safeParse('')).toEqual({ success: true, data: '2024-01-01' });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: '2024-01-01',
  });
  expect(schema.safeParse(null)).toEqual({ success: true, data: '2024-01-01' });
  expect(schema.safeParse('2024-05-04')).toEqual({
    success: true,
    data: '2024-05-04',
  });
});
