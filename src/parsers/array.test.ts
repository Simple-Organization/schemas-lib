import { test, expect } from 'bun:test';
import { array } from './array';
import { int } from '../parsers/int';
import { errorTesting } from '../utils/error';

test('Deve executar o safeParse com sucesso 1', () => {
  const schema = array(int());

  expect(schema.safeParse(['1'])).toEqual({
    success: true,
    data: [1],
  });
});

//
//

test('Deve executar o safeParse com sucesso 2', () => {
  const schema = array(int());
  errorTesting('nan', schema, ['a']);
});

//
//

test('Deve executar o safeParse com sucesso 3', () => {
  const schema = array(int());

  expect(schema.safeParse([1, 2, 3])).toEqual({
    success: true,
    data: [1, 2, 3],
  });

  expect(schema.safeParse('[1,2,3]')).toEqual({
    success: true,
    data: [1, 2, 3],
  });

  errorTesting('not_array', schema, new Set([1, 2, 3]));
  errorTesting('required', schema, undefined);
  errorTesting('required', schema, null);
  errorTesting('not_array', schema, {});
  errorTesting('nan', schema, ['a', 2]);
  errorTesting('nan', schema, '[1,"a"]');
  errorTesting('not_valid_json', schema, 'not_json');
});

test('Deve dar erro "not_valid_json" quando recebe uma string', () => {
  const schema = array(int()).optional();

  errorTesting('not_valid_json', schema, 'new Set([1, 2, 3])');
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
