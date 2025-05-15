import { test, expect } from 'bun:test';
import { url } from './url';
import { SchemaLibError } from '../SchemaLibError';

//
//

test('Deve executar o safeParse com sucesso', () => {
  const schema = url();

  expect(schema.safeParse('http://example.com')).toEqual({
    success: true,
    data: 'http://example.com',
  });

  expect(schema.safeParse('https://example.com')).toEqual({
    success: true,
    data: 'https://example.com',
  });

  expect(schema.safeParse('example.com')).toEqual({
    success: true,
    data: 'http://example.com',
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

  expect(schema.safeParse('not a url')).toEqual({
    success: false,
    error: new SchemaLibError('not_url', schema, 'not a url'),
  });

  const obj = {};
  expect(schema.safeParse(obj)).toEqual({
    success: false,
    error: new SchemaLibError('not_string_type', schema, obj),
  });
});

//
//

test('Deve ser opcional com sucesso', () => {
  const schema = url().optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('http://example.com')).toEqual({
    success: true,
    data: 'http://example.com',
  });
});

//
//

test('Deve ter default com sucesso', () => {
  const schema = url().default(() => 'http://default.com');

  expect(schema.safeParse('')).toEqual({
    success: true,
    data: 'http://default.com',
  });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: 'http://default.com',
  });
  expect(schema.safeParse(null)).toEqual({
    success: true,
    data: 'http://default.com',
  });
  expect(schema.safeParse('https://example.com')).toEqual({
    success: true,
    data: 'https://example.com',
  });
});
