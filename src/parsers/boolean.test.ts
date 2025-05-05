import { test, expect } from 'bun:test';
import { boolean } from './boolean';
import { SchemaLibError } from '../SchemaLibError';

test('Deve executar o safeParse com sucesso', () => {
  const schema = boolean();

  // true options
  expect(schema.safeParse(true)).toEqual({ success: true, data: true });
  expect(schema.safeParse(1)).toEqual({ success: true, data: true });
  expect(schema.safeParse('true')).toEqual({ success: true, data: true });
  expect(schema.safeParse('1')).toEqual({ success: true, data: true });
  expect(schema.safeParse('on')).toEqual({ success: true, data: true });

  // false options
  expect(schema.safeParse(false)).toEqual({ success: true, data: false });
  expect(schema.safeParse(0)).toEqual({ success: true, data: false });
  expect(schema.safeParse('false')).toEqual({ success: true, data: false });
  expect(schema.safeParse('0')).toEqual({ success: true, data: false });
  expect(schema.safeParse('off')).toEqual({ success: true, data: false });

  // empty string
  expect(schema.safeParse('')).toEqual({
    success: false,
    error: new SchemaLibError('required', schema, ''),
  });

  // undefined
  expect(schema.safeParse(undefined)).toEqual({
    success: false,
    error: new SchemaLibError('required', schema, undefined),
  });

  // null
  expect(schema.safeParse(null)).toEqual({
    success: false,
    error: new SchemaLibError('required', schema, null),
  });

  // invalid value
  expect(schema.safeParse('abc')).toEqual({
    success: false,
    error: new SchemaLibError('boolean_type', schema, 'abc'),
  });
  expect(schema.safeParse({})).toEqual({
    success: false,
    error: new SchemaLibError('boolean_type', schema, {}),
  });
});

test('Deve ser opcional com sucesso', () => {
  const schema = boolean().optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse(true)).toEqual({ success: true, data: true });
  expect(schema.safeParse(false)).toEqual({ success: true, data: false });
});

test('Deve ter default com sucesso', () => {
  const schema = boolean().default(() => true);

  expect(schema.safeParse('')).toEqual({ success: true, data: true });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: true });
  expect(schema.safeParse(null)).toEqual({ success: true, data: true });
  expect(schema.safeParse(false)).toEqual({ success: true, data: false });
});
