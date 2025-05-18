import { test, expect } from 'bun:test';
import { int } from './int';
import { errorTesting } from '../utils/error';

//
//

test('Deve executar o safeParse com sucesso', () => {
  const schema = int();

  expect(schema.safeParse(1)).toEqual({
    success: true,
    data: 1,
  });

  expect(schema.safeParse('1')).toEqual({
    success: true,
    data: 1,
  });

  errorTesting('not_integer', schema, '1.2');

  errorTesting('required', schema, '');

  errorTesting('required', schema, '   ');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);

  const obj = {};
  errorTesting('not_number_type', schema, obj);

  errorTesting('nan', schema, 'a');
});

//
//

test('Deve ser opcional com sucesso', () => {
  const schema = int().optional();

  const success: any = { success: true };

  expect(schema.safeParse('')).toEqual(success);
  expect(schema.safeParse('   ')).toEqual(success);
  expect(schema.safeParse(undefined)).toEqual(success);
  expect(schema.safeParse(null)).toEqual(success);
  expect(schema.safeParse(1)).toEqual({ success: true, data: 1 });
});

//
//

test('Deve ter default com sucesso', () => {
  const schema = int().default(() => 1);

  expect(schema.safeParse('')).toEqual({ success: true, data: 1 });
  expect(schema.safeParse('   ')).toEqual({ success: true, data: 1 });
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: 1 });
  expect(schema.safeParse(null)).toEqual({ success: true, data: 1 });
  expect(schema.safeParse(2)).toEqual({ success: true, data: 2 });
});

//
//

test('Deve ter testar min, max e between', () => {
  const schema1 = int().min(1);
  const schema2 = int().max(10);
  const schema3 = int().between(1, 10);

  errorTesting('min_number', schema1, 0);

  expect(schema1.safeParse(1)).toEqual({
    success: true,
    data: 1,
  });

  expect(schema2.safeParse(2)).toEqual({
    success: true,
    data: 2,
  });

  expect(schema2.safeParse(10)).toEqual({
    success: true,
    data: 10,
  });

  errorTesting('max_number', schema2, 11);

  errorTesting('min_number', schema3, 0);

  expect(schema3.safeParse(1)).toEqual({
    success: true,
    data: 1,
  });
});

//
//

test('Valor default não pode cancelar erro', () => {
  const schema = int().default(() => 1);

  errorTesting('nan', schema, 'asdf');
});
