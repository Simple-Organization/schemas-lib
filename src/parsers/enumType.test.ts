import { test, expect } from 'bun:test';
import { enumType } from './enumType';
import { SchemaLibError } from '../SchemaLibError';

//
//

test('Deve executar o safeParse com sucesso', () => {
  const schema = enumType(['A', 'B']);
  // @ts-ignore
  schema.enum = ['A', 'B'];

  expect(schema.safeParse('A')).toEqual({
    success: true,
    data: 'A',
  });

  expect(schema.safeParse('B')).toEqual({
    success: true,
    data: 'B',
  });

  expect(schema.safeParse('C')).toEqual({
    success: false,
    error: new SchemaLibError('not_enum', schema, 'C'),
  });

  expect(schema.safeParse(1)).toEqual({
    success: false,
    error: new SchemaLibError('not_string_type', schema, 1),
  });

  expect(schema.safeParse(undefined)).toEqual({
    success: false,
    error: new SchemaLibError('required', schema, undefined),
  });
});

//
//

test('Deve ser opcional com sucesso', () => {
  const schema = enumType(['A', 'B']).optional();
  // @ts-ignore
  schema.enum = ['A', 'B'];

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('A')).toEqual({ success: true, data: 'A' });
});

//
//

test('Deve ter default com sucesso', () => {
  const schema = enumType(['A', 'B']).default(() => 'A');
  // @ts-ignore
  schema.enum = ['A', 'B'];

  expect(schema.safeParse('')).toEqual({ success: true, data: 'A' });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: 'A' });
  expect(schema.safeParse(null)).toEqual({ success: true, data: 'A' });
  expect(schema.safeParse('B')).toEqual({ success: true, data: 'B' });
});
