import { test, expect } from 'bun:test';
import { NumberSchema2 } from './float2';
import { SchemaLibError } from '../SchemaLibError';

//
//

test('Deve executar o safeParse com sucesso', () => {
  const schema = new NumberSchema2();

  expect(schema.safeParse(1)).toEqual({
    success: true,
    data: 1,
  });

  expect(schema.safeParse('1')).toEqual({
    success: true,
    data: 1,
  });

  expect(schema.safeParse('1.2')).toEqual({
    success: true,
    data: 1.2,
  });

  expect(schema.safeParse('')).toEqual({
    success: false,
    error: new SchemaLibError('required', schema, ''),
  });

  expect(schema.safeParse('   ')).toEqual({
    success: false,
    error: new SchemaLibError('required', schema, '   '),
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
    error: new SchemaLibError('not_number_type', schema, obj),
  });

  expect(schema.safeParse('a')).toEqual({
    success: false,
    error: new SchemaLibError('nan', schema, 'a'),
  });
});

//
//

test('Deve ser opcional com sucesso', () => {
  const schema = new NumberSchema2().optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse('   ')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse(1)).toEqual({ success: true, data: 1 });
});

//
//

test('Deve ter default com sucesso', () => {
  const schema = new NumberSchema2().default(() => 1);

  expect(schema.safeParse('')).toEqual({ success: true, data: 1 });
  expect(schema.safeParse('   ')).toEqual({ success: true, data: 1 });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: 1 });
  expect(schema.safeParse(null)).toEqual({ success: true, data: 1 });
  expect(schema.safeParse(2)).toEqual({ success: true, data: 2 });
});
