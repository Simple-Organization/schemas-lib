import { test, expect } from 'bun:test';
import { string, StringSchema, trimmed } from './string';
import type { Schema } from '../version2/Schema';
import { errorTesting } from '../utils/error';

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

    errorTesting('required', schema, '');

    if (schema.trim) {
      errorTesting('required', schema, '   ');
    } else {
      expect(schema.safeParse('   ')).toEqual({
        success: true,
        data: '   ',
      });
    }

    errorTesting('required', schema, undefined);

    errorTesting('required', schema, null);

    const obj = {};
    errorTesting('not_string_type', schema, obj);
  },
);

//
//

test.each([
  [trimmed().optional() as Schema<string | null | undefined>],
  [string().optional() as Schema<string | null | undefined>],
])('Deve ser opcional com sucesso', (schema) => {
  const success: any = { success: true };

  expect(schema.safeParse('')).toEqual(success);
  if ((schema as StringSchema).trim) {
    expect(schema.safeParse('   ')).toEqual(success);
  }
  expect(schema.safeParse(undefined)).toEqual(success);
  expect(schema.safeParse(null)).toEqual(success);
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

//
//

test('Deve transformar o valor com sucesso', () => {
  const schema = string().transform((value) => {
    return value + '1';
  });

  expect(schema.safeParse('2')).toEqual({ success: true, data: '21' });
  errorTesting('not_string_type', schema, 2);
  errorTesting('not_string_type', schema, true);
  errorTesting('not_string_type', schema, false);
  expect(schema.safeParse('aaaa')).toEqual({ success: true, data: 'aaaa1' });
});
