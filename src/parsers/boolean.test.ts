import { test, expect } from 'bun:test';
import { boolean } from './boolean';
import { errorTesting } from '../utils/error';

test('Deve executar o safeParse com sucesso', () => {
  const schema = boolean();

  // true options
  expect(schema.safeParse(true)).toEqual({ success: true, data: true });
  expect(schema.safeParse(1)).toEqual({ success: true, data: true });
  expect(schema.safeParse('true')).toEqual({ success: true, data: true });
  expect(schema.safeParse('1')).toEqual({ success: true, data: true });
  expect(schema.safeParse('on')).toEqual({ success: true, data: true });

  // false options
  expect(schema.safeParse(false)).toEqual({ success: true, data: false });
  expect(schema.safeParse(0)).toEqual({ success: true, data: false });
  expect(schema.safeParse('false')).toEqual({ success: true, data: false });
  expect(schema.safeParse('0')).toEqual({ success: true, data: false });
  expect(schema.safeParse('off')).toEqual({ success: true, data: false });

  // empty string
  errorTesting('required', schema, '');

  // undefined
  errorTesting('required', schema, undefined);

  // null
  errorTesting('required', schema, null);

  // invalid value
  errorTesting('boolean_type', schema, 'abc');
  errorTesting('boolean_type', schema, {});
});

test('Deve ser opcional com sucesso', () => {
  const schema = boolean().optional();

  const success: any = { success: true };

  expect(schema.safeParse('')).toEqual(success);
  expect(schema.safeParse(undefined)).toEqual(success);
  expect(schema.safeParse(null)).toEqual(success);
  expect(schema.safeParse(true)).toEqual({ success: true, data: true });
  expect(schema.safeParse(false)).toEqual({ success: true, data: false });
});

test('Deve ter default com sucesso', () => {
  const schema = boolean().default(() => true);

  expect(schema.safeParse('')).toEqual({ success: true, data: true });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: true });
  expect(schema.safeParse(null)).toEqual({ success: true, data: true });
  expect(schema.safeParse(false)).toEqual({ success: true, data: false });
});
