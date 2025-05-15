import { test, expect } from 'bun:test';
import { cpf } from './cpf';
import { SchemaLibError } from '../SchemaLibError';

test('Deve executar o safeParse com sucesso', () => {
  const schema = cpf();

  expect(schema.safeParse('529.982.247-25')).toEqual({
    success: true,
    data: '529.982.247-25',
  });

  expect(schema.safeParse('52998224725')).toEqual({
    success: true,
    data: '529.982.247-25',
  });

  expect(schema.safeParse('111.111.111-11')).toEqual({
    success: false,
    error: new SchemaLibError('not_cpf', schema, '111.111.111-11'),
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
  const schema = cpf().optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('529.982.247-25')).toEqual({
    success: true,
    data: '529.982.247-25',
  });
});

test('Deve ter default com sucesso', () => {
  const schema = cpf().default(() => '529.982.247-25');

  expect(schema.safeParse('')).toEqual({
    success: true,
    data: '529.982.247-25',
  });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: '529.982.247-25',
  });
  expect(schema.safeParse(null)).toEqual({
    success: true,
    data: '529.982.247-25',
  });
  expect(schema.safeParse('529.982.247-25')).toEqual({
    success: true,
    data: '529.982.247-25',
  });
});
