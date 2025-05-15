import { expect, test } from 'bun:test';
import { getSchemaByPath } from './getSchemaByPath';
import { object, strict } from '../parsers/object';
import { array, ArraySchema } from '../parsers/array';
import { int, string } from '../s';

//
//

const userSchema = object({
  name: string(),
  age: int(),
  address: object({
    street: string(),
    city: string(),
  }),
  tags: array(string()),
});

test('getSchemaByPath returns correct schema for top-level key', () => {
  expect(getSchemaByPath('name', userSchema)).toBe(userSchema.shape.name);
  expect(getSchemaByPath('age', userSchema)).toBe(userSchema.shape.age);
});

test('getSchemaByPath returns correct schema for nested object', () => {
  expect(getSchemaByPath('address.street', userSchema)).toBe(
    userSchema.shape.address.shape.street,
  );
  expect(getSchemaByPath('address.city', userSchema)).toBe(
    userSchema.shape.address.shape.city,
  );
});

test('getSchemaByPath returns correct schema for array element', () => {
  const tagsSchema = getSchemaByPath('tags', userSchema);
  expect(tagsSchema).toBeInstanceOf(ArraySchema);
  if (tagsSchema instanceof ArraySchema) {
    expect(tagsSchema.element).toBe(userSchema.shape.tags.element);
  }
});

test('getSchemaByPath returns undefined for invalid path', () => {
  expect(getSchemaByPath('nonexistent', userSchema)).toBeUndefined();
  expect(getSchemaByPath('address.zip', userSchema)).toBeUndefined();
  expect(getSchemaByPath('tags.foo', userSchema)).toBeDefined(); // O algoritmo para ter performance não faz essa verificação
});

test('getSchemaByPath works with strict object schemas', () => {
  const strictSchema = strict({ foo: string() });
  expect(getSchemaByPath('foo', strictSchema)).toBe(strictSchema.shape.foo);
  expect(getSchemaByPath('bar', strictSchema)).toBeUndefined();
});
