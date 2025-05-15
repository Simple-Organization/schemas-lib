import { test, expect } from 'bun:test';
import { telefone } from './telefone';
import { SchemaLibError } from '../SchemaLibError';

test('Deve executar o safeParse com sucesso', () => {
  const schema = telefone();

  expect(schema.safeParse('(11) 91234-5678')).toEqual({
    success: true,
    data: '(11) 91234-5678',
  });

  expect(schema.safeParse('11912345678')).toEqual({
    success: true,
    data: '(11) 91234-5678',
  });

  expect(schema.safeParse('11111111111')).toEqual({
    success: false,
    error: new SchemaLibError('not_telefone', schema, '11111111111'),
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
  const schema = telefone().optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('(11) 91234-5678')).toEqual({
    success: true,
    data: '(11) 91234-5678',
  });
});

test('Deve ter default com sucesso', () => {
  const schema = telefone().default(() => '(11) 91234-5678');

  expect(schema.safeParse('')).toEqual({
    success: true,
    data: '(11) 91234-5678',
  });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: '(11) 91234-5678',
  });
  expect(schema.safeParse(null)).toEqual({
    success: true,
    data: '(11) 91234-5678',
  });
  expect(schema.safeParse('(11) 91234-5678')).toEqual({
    success: true,
    data: '(11) 91234-5678',
  });
});
