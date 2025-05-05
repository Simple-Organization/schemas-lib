import { test, expect } from 'bun:test';
import { discriminatedUnion } from './discriminatedUnion';
import { object } from './object';
import { literal } from './literal';
import { int } from './int';
import { SchemaLibError } from '../SchemaLibError';

const CatSchema = object({
  type: literal('cat'),
  name: literal('meow'),
  age: int(),
});

const DogSchema = object({
  type: literal('dog'),
  breed: literal('labrador'),
  age: int(),
});

const schema = discriminatedUnion('type', [CatSchema, DogSchema]);

test('Deve executar o safeParse com sucesso para cat', () => {
  expect(schema.safeParse({ type: 'cat', name: 'meow', age: 2 })).toEqual({
    success: true,
    data: { type: 'cat', name: 'meow', age: 2 },
  });
});

test('Deve executar o safeParse com sucesso para dog', () => {
  expect(schema.safeParse({ type: 'dog', breed: 'labrador', age: 5 })).toEqual({
    success: true,
    data: { type: 'dog', breed: 'labrador', age: 5 },
  });
});

test('Deve falhar se discriminador estiver ausente', () => {
  expect(schema.safeParse({ name: 'meow', age: 2 })).toEqual({
    success: false,
    error: new SchemaLibError('missing_discriminator', schema, {
      name: 'meow',
      age: 2,
    }),
  });
});

test('Deve falhar se discriminador for inválido', () => {
  expect(schema.safeParse({ type: 'bird', age: 1 })).toEqual({
    success: false,
    error: new SchemaLibError('invalid_discriminator', schema, {
      type: 'bird',
      age: 1,
    }),
  });
});

test('Deve falhar se não for um json válido', () => {
  expect(schema.safeParse('not a valid json')).toEqual({
    success: false,
    error: new SchemaLibError('not_valid_json', schema, 'not a valid json'),
  });
});

test('Deve ser opcional com sucesso', () => {
  const optionalSchema = schema.optional();
  expect(optionalSchema.safeParse('')).toEqual({ success: true, data: null });
  expect(optionalSchema.safeParse(undefined)).toEqual({
    success: true,
    data: null,
  });
  expect(optionalSchema.safeParse(null)).toEqual({ success: true, data: null });
  expect(
    optionalSchema.safeParse({ type: 'cat', name: 'meow', age: 2 }),
  ).toEqual({
    success: true,
    data: { type: 'cat', name: 'meow', age: 2 },
  });
});

test('Deve ter default com sucesso', () => {
  const defaultValue: { type: 'dog'; breed: 'labrador'; age: number } = {
    type: 'dog',
    breed: 'labrador',
    age: 10,
  };
  const defaultSchema = schema.default(
    () => defaultValue as { type: 'dog'; breed: 'labrador'; age: number },
  );

  expect(defaultSchema.safeParse('')).toEqual({
    success: true,
    data: defaultValue,
  });
  expect(defaultSchema.safeParse(undefined)).toEqual({
    success: true,
    data: defaultValue,
  });
  expect(defaultSchema.safeParse(null)).toEqual({
    success: true,
    data: defaultValue,
  });
  expect(
    defaultSchema.safeParse({ type: 'dog', breed: 'labrador', age: 5 }),
  ).toEqual({
    success: true,
    data: { type: 'dog', breed: 'labrador', age: 5 },
  });
});
