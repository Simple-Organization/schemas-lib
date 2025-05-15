import { test, expect } from 'bun:test';
import { rg } from './rg';
import { SchemaLibError } from '../SchemaLibError';

test('Deve executar o safeParse com sucesso', () => {
  const schema = rg();

  expect(schema.safeParse('12.345.678-9')).toEqual({
    success: true,
    data: '12.345.678-9',
  });

  expect(schema.safeParse('123456789')).toEqual({
    success: true,
    data: '12.345.678-9',
  });

  expect(schema.safeParse('1234')).toEqual({
    success: true,
    data: '12.34.-',
  });

  expect(schema.safeParse('11111111')).toEqual({
    success: false,
    error: new SchemaLibError('not_rg', schema, '11111111'),
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
  const schema = rg().optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('12.345.678-9')).toEqual({
    success: true,
    data: '12.345.678-9',
  });
});

test('Deve ter default com sucesso', () => {
  const schema = rg().default(() => '12.345.678-9');

  expect(schema.safeParse('')).toEqual({
    success: true,
    data: '12.345.678-9',
  });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: '12.345.678-9',
  });
  expect(schema.safeParse(null)).toEqual({
    success: true,
    data: '12.345.678-9',
  });
  expect(schema.safeParse('32.631.188-9')).toEqual({
    success: true,
    data: '32.631.188-9',
  });
});
