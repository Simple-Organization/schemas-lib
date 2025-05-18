import { test, expect } from 'bun:test';
import { literal } from './literal';
import { errorTesting } from '../utils/error';

test('Deve executar o safeParse com sucesso', () => {
  const schema = literal('abc');

  expect(schema.safeParse('abc')).toEqual({
    success: true,
    data: 'abc',
  });

  errorTesting('not_literal_equal', schema, 'def');

  errorTesting('required', schema, '');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);
});

test('Deve ser opcional com sucesso', () => {
  const schema = literal(123).optional();

  const success: any = { success: true };
  expect(schema.safeParse('')).toEqual(success);
  expect(schema.safeParse(undefined)).toEqual(success);
  expect(schema.safeParse(null)).toEqual(success);
  expect(schema.safeParse(123)).toEqual({ success: true, data: 123 });
});

test('Deve ter default com sucesso', () => {
  const schema = literal(true).default(() => true);

  expect(schema.safeParse('')).toEqual({ success: true, data: true });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: true });
  expect(schema.safeParse(null)).toEqual({ success: true, data: true });
  expect(schema.safeParse(true)).toEqual({ success: true, data: true });
});
