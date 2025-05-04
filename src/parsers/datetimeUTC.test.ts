import { test, expect } from 'bun:test';
import { datetimeUTC } from './datetimeUTC';
import { SchemaLibError } from '../SchemaLibError';

test('Deve clonar o schema com sucesso', () => {
  const schema = datetimeUTC();
  const clone = schema.clone();
  expect(clone).toEqual(schema);
});

test('Deve executar o safeParse com sucesso', () => {
  const schema = datetimeUTC();

  const validDate = '2024-06-01T12:34:56Z';
  expect(schema.safeParse(validDate)).toEqual({
    success: true,
    data: validDate,
  });

  const validDateWithMs = '2024-06-01T12:34:56.123Z';
  expect(schema.safeParse(validDateWithMs)).toEqual({
    success: true,
    data: validDateWithMs,
  });

  const dateObj = new Date('2024-06-01T12:34:56Z');
  expect(schema.safeParse(dateObj)).toEqual({
    success: true,
    data: dateObj.toISOString(),
  });

  const timestamp = Date.UTC(2024, 5, 1, 12, 34, 56);
  expect(schema.safeParse(timestamp)).toEqual({
    success: true,
    data: new Date(timestamp).toISOString(),
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

  expect(schema.safeParse('2024-06-01 12:34:56')).toEqual({
    success: false,
    error: new SchemaLibError(
      'not_utc_datetime_string',
      schema,
      '2024-06-01 12:34:56',
    ),
  });

  expect(schema.safeParse('2024-06-01T12:34:56+03:00')).toEqual({
    success: false,
    error: new SchemaLibError(
      'not_utc_datetime_string',
      schema,
      '2024-06-01T12:34:56+03:00',
    ),
  });

  expect(schema.safeParse({})).toEqual({
    success: false,
    error: new SchemaLibError('not_datetime_type', schema, {}),
  });
});

test('Deve ser opcional com sucesso', () => {
  const schema = datetimeUTC().optional();

  expect(schema.safeParse('')).toEqual({ success: true });
  expect(schema.safeParse('   ')).toEqual({ success: true });
  expect(schema.safeParse(undefined)).toEqual({ success: true });
  expect(schema.safeParse(null)).toEqual({ success: true });

  const validDate = '2024-06-01T12:34:56Z';
  expect(schema.safeParse(validDate)).toEqual({
    success: true,
    data: validDate,
  });
});

test('Deve ter default com sucesso', () => {
  const defaultDate = '2024-06-01T12:34:56Z';
  const schema = datetimeUTC().default(() => defaultDate);

  expect(schema.safeParse('')).toEqual({ success: true, data: defaultDate });
  expect(schema.safeParse('   ')).toEqual({ success: true, data: defaultDate });
  expect(schema.safeParse(undefined)).toEqual({
    success: true,
    data: defaultDate,
  });
  expect(schema.safeParse(null)).toEqual({ success: true, data: defaultDate });

  const validDate = '2024-06-01T12:34:56Z';
  expect(schema.safeParse(validDate)).toEqual({
    success: true,
    data: validDate,
  });
});
