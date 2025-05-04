import { test, expect } from 'bun:test';
import { NumberSchema } from '../../src';
import { SchemaLibError } from '../SchemaLibError';

//
//

test('Deve clonar o schema com sucesso', () => {
  const schema = new NumberSchema();

  const clone = schema.clone();

  expect(clone).toEqual(schema);
});

//
//

test('Deve executar o safeParse com sucesso', () => {
  const schema = new NumberSchema();

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
