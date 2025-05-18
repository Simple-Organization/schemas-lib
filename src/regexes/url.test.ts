import { test, expect } from 'bun:test';
import { url } from './url';
import { SchemaLibError } from '../SchemaLibError';
import { errorTesting } from '../utils/error';

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

  errorTesting('required', schema, '');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);

  errorTesting('not_url', schema, 'not a url');

  const obj = {};
  errorTesting('not_string_type', schema, obj);
});

//
//

test('Deve ser opcional com sucesso', () => {
  const schema = url().optional();

  const success: any = { success: true };

  expect(schema.safeParse('')).toEqual(success);
  expect(schema.safeParse(undefined)).toEqual(success);
  expect(schema.safeParse(null)).toEqual(success);
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
