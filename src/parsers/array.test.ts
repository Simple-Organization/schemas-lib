import { test, expect } from 'bun:test';
import { array } from './array';
import { int } from '../parsers/int';
import { SchemaLibError } from '../SchemaLibError';

test('Deve executar o safeParse com sucesso', () => {
  const schema = array(int());

  expect(schema.safeParse([1, 2, 3])).toEqual({
    success: true,
    data: [1, 2, 3],
  });

  expect(schema.safeParse(['1', 2, 3])).toEqual({
    success: true,
    data: [1, 2, 3],
  });

  expect(schema.safeParse('[1,2,3]')).toEqual({
    success: true,
    data: [1, 2, 3],
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

  expect(schema.safeParse({})).toEqual({
    success: false,
    error: new SchemaLibError('not_array', schema, {}),
  });

  expect(schema.safeParse(['a', 2])).toEqual({
    success: false,
    error: new SchemaLibError('invalid_array_element', schema, ['a', 2]),
  });

  expect(schema.safeParse('[1,"a"]')).toEqual({
    success: false,
    error: new SchemaLibError('invalid_array_element', schema, '[1,"a"]'),
  });

  expect(schema.safeParse('not_json')).toEqual({
    success: false,
    error: new SchemaLibError('not_valid_json', schema, 'not_json'),
  });
});

test('Deve ser opcional com sucesso', () => {
  const schema = array(int()).optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse([1, 2])).toEqual({ success: true, data: [1, 2] });
});

test('Deve ter default com sucesso', () => {
  const schema = array(int()).default(() => [1, 2]);

  expect(schema.safeParse('')).toEqual({ success: true, data: [1, 2] });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: [1, 2] });
  expect(schema.safeParse(null)).toEqual({ success: true, data: [1, 2] });
  expect(schema.safeParse([3])).toEqual({ success: true, data: [3] });
});
