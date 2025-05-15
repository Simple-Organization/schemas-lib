import { test, expect } from 'bun:test';
import { enumType } from './enum';
import { errorTesting } from '../utils/error';

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

  errorTesting('not_enum', schema, 'C');

  errorTesting('not_string_type', schema, 1);

  errorTesting('required', schema, undefined);
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

test('Deve funcionar com uma array externa', () => {
  const role = ['dev', 'admin', 'escritorio', 'tecnico'] as const;

  const schema = enumType(role).optional();

  expect(schema.safeParse('dev')).toEqual({ success: true, data: 'dev' });
  expect(schema.safeParse('admin')).toEqual({ success: true, data: 'admin' });
  expect(schema.safeParse('escritorio')).toEqual({
    success: true,
    data: 'escritorio',
  });
  expect(schema.safeParse('tecnico')).toEqual({
    success: true,
    data: 'tecnico',
  });
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
