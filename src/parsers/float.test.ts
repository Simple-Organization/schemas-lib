import { test, expect } from 'bun:test';
import { number, NumberSchema } from './float';
import { errorTesting } from '../utils/error';

//
//

test('Deve executar o safeParse com sucesso', () => {
  const schema = number();

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

  errorTesting('required', schema, '');

  errorTesting('required', schema, '   ');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);

  const obj = {};
  errorTesting('not_number_type', schema, obj);

  errorTesting('not_number_type', schema, obj);

  errorTesting('nan', schema, 'a');
});

//
//

test('Deve ser opcional com sucesso', () => {
  const schema = new NumberSchema().optional();

  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  expect(schema.safeParse('   ')).toEqual({ success: true, data: null });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse(1)).toEqual({ success: true, data: 1 });
});

//
//

test('Deve ter default com sucesso', () => {
  const schema = new NumberSchema().default(() => 1);

  expect(schema.safeParse('')).toEqual({ success: true, data: 1 });
  expect(schema.safeParse('   ')).toEqual({ success: true, data: 1 });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: 1 });
  expect(schema.safeParse(null)).toEqual({ success: true, data: 1 });
  expect(schema.safeParse(2)).toEqual({ success: true, data: 2 });
});
