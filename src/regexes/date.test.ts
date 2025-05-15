import { test, expect } from 'bun:test';
import { date } from './date';
import { errorTesting } from '../utils/error';

//
//
test.only('Deve executar o safeParse com sucesso', () => {
  const schema = date();

  expect(schema.safeParse('2024-05-04')).toEqual({
    success: true,
    data: '2024-05-04',
  });

  expect(schema.safeParse('2024-02-29')).toEqual({
    success: true,
    data: '2024-02-29',
  });

  errorTesting('not_date', schema, '2024-02-30');

  errorTesting('not_date', schema, '2024-02-64');

  errorTesting('not_date', schema, '2024-5-4');

  errorTesting('required', schema, '');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);

  const obj = {};
  errorTesting('not_string_type', schema, obj);
});

//
//
test('Deve ser opcional com sucesso', () => {
  const schema = date().optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('2024-05-04')).toEqual({
    success: true,
    data: '2024-05-04',
  });
});

//
//
test('Deve ter default com sucesso', () => {
  const schema = date().default(() => '2024-01-01');

  expect(schema.safeParse('')).toEqual({ success: true, data: '2024-01-01' });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: '2024-01-01',
  });
  expect(schema.safeParse(null)).toEqual({ success: true, data: '2024-01-01' });
  expect(schema.safeParse('2024-05-04')).toEqual({
    success: true,
    data: '2024-05-04',
  });
});
