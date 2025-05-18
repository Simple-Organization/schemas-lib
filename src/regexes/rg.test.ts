import { test, expect } from 'bun:test';
import { rg } from './rg';
import { errorTesting } from '../utils/error';

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

  errorTesting('not_rg', schema, '11111111');

  errorTesting('required', schema, '');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);

  const obj = {};
  errorTesting('not_string_type', schema, obj);
});

test('Deve ser opcional com sucesso', () => {
  const schema = rg().optional();

  const success: any = { success: true };

  expect(schema.safeParse('')).toEqual(success);
  expect(schema.safeParse(undefined)).toEqual(success);
  expect(schema.safeParse(null)).toEqual(success);
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
