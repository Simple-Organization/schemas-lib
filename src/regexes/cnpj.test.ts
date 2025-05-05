import { test, expect } from 'bun:test';
import { cnpj } from './cnpj';
import { SchemaLibError } from '../SchemaLibError';

test('Deve executar o safeParse com sucesso', () => {
  const schema = cnpj();

  expect(schema.safeParse('04.252.011/0001-10')).toEqual({
    success: true,
    data: '04.252.011/0001-10',
  });

  expect(schema.safeParse('04252011000110')).toEqual({
    success: true,
    data: '04.252.011/0001-10',
  });

  expect(schema.safeParse('11.111.111/1111-11')).toEqual({
    success: false,
    error: new SchemaLibError('not_cpf', schema, '11.111.111/1111-11'),
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
  const schema = cnpj().optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('04.252.011/0001-10')).toEqual({
    success: true,
    data: '04.252.011/0001-10',
  });
});

test('Deve ter default com sucesso', () => {
  const schema = cnpj().default(() => '04.252.011/0001-10');

  expect(schema.safeParse('')).toEqual({
    success: true,
    data: '04.252.011/0001-10',
  });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: '04.252.011/0001-10',
  });
  expect(schema.safeParse(null)).toEqual({
    success: true,
    data: '04.252.011/0001-10',
  });
  expect(schema.safeParse('04.252.011/0001-10')).toEqual({
    success: true,
    data: '04.252.011/0001-10',
  });
});
