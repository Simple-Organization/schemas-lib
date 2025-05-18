import { test, expect } from 'bun:test';
import { cpf } from './cpf';
import { errorTesting } from '../utils/error';

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

  errorTesting('not_cpf', schema, '111.111.111-11');

  errorTesting('required', schema, '');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);

  const obj = {};
  errorTesting('not_string_type', schema, obj);
});

test('Deve ser opcional com sucesso', () => {
  const schema = cpf().optional();

  const success: any = { success: true };

  expect(schema.safeParse('')).toEqual(success);
  expect(schema.safeParse(undefined)).toEqual(success);
  expect(schema.safeParse(null)).toEqual(success);
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
