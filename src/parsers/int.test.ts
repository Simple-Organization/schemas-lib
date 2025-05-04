import { test, expect } from 'bun:test';
import { int } from './int';
import { SchemaLibError } from '../SchemaLibError';

//
//

test('Deve clonar o schema com sucesso', () => {
  const schema = int();

  const clone = schema.clone();

  expect(clone).toEqual(schema);
});

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

  expect(schema.safeParse('1.2')).toEqual({
    success: false,
    error: new SchemaLibError('not_integer', schema, '1.2'),
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
    error: new SchemaLibError('not_integer', schema, 'a'),
  });
});

//
//

test('Deve ser opcional com sucesso', () => {
  const schema = int().optional();

  expect(schema.safeParse('')).toEqual({ success: true });
  expect(schema.safeParse('   ')).toEqual({ success: true });
  expect(schema.safeParse(undefined)).toEqual({ success: true });
  expect(schema.safeParse(null)).toEqual({ success: true });
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

  expect(schema1.safeParse(0)).toEqual({
    success: false,
    error: new SchemaLibError('min_number', schema1, 0),
  });

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

  expect(schema2.safeParse(11)).toEqual({
    success: false,
    error: new SchemaLibError('max_number', schema2, 11),
  });

  expect(schema3.safeParse(0)).toEqual({
    success: false,
    error: new SchemaLibError('min_number', schema3, 0),
  });

  expect(schema3.safeParse(1)).toEqual({
    success: true,
    data: 1,
  });
});
