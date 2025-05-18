import { test, expect } from 'bun:test';
import { cnpj } from './cnpj';
import { errorTesting } from '../utils/error';

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

  errorTesting('not_cnpj', schema, '11.111.111/1111-11');

  errorTesting('required', schema, '');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);

  const obj = {};
  errorTesting('not_string_type', schema, obj);
});

test('Deve ser opcional com sucesso', () => {
  const schema = cnpj().optional();

  const success: any = { success: true };

  expect(schema.safeParse('')).toEqual(success);
  expect(schema.safeParse(undefined)).toEqual(success);
  expect(schema.safeParse(null)).toEqual(success);
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
