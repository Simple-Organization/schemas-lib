import { test, expect } from 'bun:test';
import { string, StringSchema, trimmed } from './string';
import { SchemaLibError } from '../SchemaLibError';
import type { ISchema } from '../schemas/NewSchema';
import type { MinMaxSchema } from '../schemas/MinMaxSchema';

//
//

test('Deve clonar o schema com sucesso', () => {
  const schema = trimmed();

  const clone = schema.clone();

  expect(clone).toEqual(schema);
});

//
//

test.each([[trimmed() as StringSchema], [string() as StringSchema]])(
  'Deve executar o safeParse com sucesso',
  (schema) => {
    expect(schema.safeParse('1')).toEqual({
      success: true,
      data: '1',
    });

    expect(schema.safeParse('1.2')).toEqual({
      success: true,
      data: '1.2',
    });

    expect(schema.safeParse('')).toEqual({
      success: false,
      error: new SchemaLibError('required', schema, ''),
    });

    if (schema.trim) {
      expect(schema.safeParse('   ')).toEqual({
        success: false,
        error: new SchemaLibError('required', schema, '   '),
      });
    } else {
      expect(schema.safeParse('   ')).toEqual({
        success: true,
        data: '   ',
      });
    }

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
      error: new SchemaLibError('not_string_type', schema, obj),
    });
  },
);

//
//

test.each([
  [trimmed().optional() as MinMaxSchema<string | null | undefined>],
  [string().optional() as MinMaxSchema<string | null | undefined>],
])('Deve ser opcional com sucesso', (schema) => {
  expect(schema.safeParse('')).toEqual({ success: true, data: null });
  if ((schema as StringSchema).trim) {
    expect(schema.safeParse('   ')).toEqual({ success: true, data: null });
  }
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse('1')).toEqual({ success: true, data: '1' });
});

//
//

test.each([
  [trimmed().default(() => '1') as StringSchema],
  [string().default(() => '1') as StringSchema],
  [
    trimmed()
      .optional()
      .default(() => '1') as StringSchema,
  ],
  [
    string()
      .optional()
      .default(() => '1') as StringSchema,
  ],
])('Deve ter default com sucesso', (schema) => {
  expect(schema.safeParse('')).toEqual({ success: true, data: '1' });
  if (schema.trim) {
    expect(schema.safeParse('   ')).toEqual({ success: true, data: '1' });
  }
  expect(schema.safeParse(undefined)).toEqual({ success: true, data: '1' });
  expect(schema.safeParse(null)).toEqual({ success: true, data: '1' });
  expect(schema.safeParse('2')).toEqual({ success: true, data: '2' });
});
