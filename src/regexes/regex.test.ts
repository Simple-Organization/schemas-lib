import { test, expect } from 'bun:test';
import { regex } from './regex';
import { SchemaLibError } from '../SchemaLibError';

//
//

test('Deve executar o safeParse com sucesso', () => {
  const schema = regex(/^[a-z]+$/);

  expect(schema.safeParse('abc')).toEqual({
    success: true,
    data: 'abc',
  });

  expect(schema.safeParse('ABC')).toEqual({
    success: false,
    error: new SchemaLibError('not_regex', schema, 'ABC'),
  });

  expect(schema.safeParse('123')).toEqual({
    success: false,
    error: new SchemaLibError('not_regex', schema, '123'),
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

//
//

test('Deve usar mensagem customizada', () => {
  const schema = regex(/^\d+$/, 'apenas números');

  expect(schema.safeParse('abc')).toEqual({
    success: false,
    error: new SchemaLibError('not_regex', schema, 'abc'),
  });
});

//
//

test('Deve ser opcional com sucesso', () => {
  const schema = regex(/^[a-z]+$/).optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('abc')).toEqual({ success: true, data: 'abc' });
});

//
//

test('Deve ter default com sucesso', () => {
  const schema = regex(/^[a-z]+$/).default(() => 'default');

  expect(schema.safeParse('')).toEqual({ success: true, data: 'default' });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: 'default',
  });
  expect(schema.safeParse(null)).toEqual({ success: true, data: 'default' });
  expect(schema.safeParse('abc')).toEqual({ success: true, data: 'abc' });
});
