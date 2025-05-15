import { test, expect } from 'bun:test';
import { mes } from './month';
import { errorTesting } from '../utils/error';

test('Deve executar o safeParse com sucesso', () => {
  const schema = mes();

  expect(schema.safeParse('2024-05')).toEqual({
    success: true,
    data: '2024-05',
  });

  errorTesting('not_month', schema, '2024-13');

  errorTesting('not_month', schema, '2024-5');

  errorTesting('not_month', schema, '2024-64');

  errorTesting('required', schema, '');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);

  const obj = {};
  errorTesting('not_string_type', schema, obj);
});

test('Deve ser opcional com sucesso', () => {
  const schema = mes().optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('2024-05')).toEqual({
    success: true,
    data: '2024-05',
  });
});

test('Deve ter default com sucesso', () => {
  const schema = mes().default(() => '2024-01');

  expect(schema.safeParse('')).toEqual({ success: true, data: '2024-01' });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: '2024-01',
  });
  expect(schema.safeParse(null)).toEqual({ success: true, data: '2024-01' });
  expect(schema.safeParse('2024-05')).toEqual({
    success: true,
    data: '2024-05',
  });
});
