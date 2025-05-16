import { test, expect } from 'bun:test';
import { regex } from './regex';
import { errorTesting } from '../utils/error';

//
//

test('Deve executar o safeParse com sucesso', () => {
  const schema = regex(/^[a-z]+$/, 'Apenas letras minúsculas');

  expect(schema.safeParse('abc')).toEqual({
    success: true,
    data: 'abc',
  });

  errorTesting('not_regex', schema, 'ABC');

  errorTesting('not_regex', schema, '123');

  errorTesting('required', schema, '');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);

  const obj = {};
  errorTesting('not_string_type', schema, obj);
});

//
//

test('Deve usar mensagem customizada', () => {
  const schema = regex(/^\d+$/, 'apenas números');

  errorTesting('not_regex', schema, 'abc');

  expect((schema.safeParse('AAAAAAA') as any).error.issues[0].message).toBe(
    'apenas números',
  );
});

//
//

test('Deve ser opcional com sucesso', () => {
  const schema = regex(/^[a-z]+$/, 'Apenas letras minúsculas').optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('abc')).toEqual({ success: true, data: 'abc' });
});

//
//

test('Deve ter default com sucesso', () => {
  const schema = regex(/^[a-z]+$/, 'Apenas letras minúsculas').default(
    () => 'default',
  );

  expect(schema.safeParse('')).toEqual({ success: true, data: 'default' });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: 'default',
  });
  expect(schema.safeParse(null)).toEqual({ success: true, data: 'default' });
  expect(schema.safeParse('abc')).toEqual({ success: true, data: 'abc' });
});
