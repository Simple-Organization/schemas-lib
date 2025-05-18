import { test, expect } from 'bun:test';
import { datetimeUTC } from './datetimeUTC';
import { errorTesting } from '../utils/error';

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
    data: '2024-06-01T12:34:56Z',
  });

  const timestamp = Date.UTC(2024, 5, 1, 12, 34, 56);
  expect(schema.safeParse(timestamp)).toEqual({
    success: true,
    data: '2024-06-01T12:34:56Z',
  });

  errorTesting('required', schema, '');

  errorTesting('required', schema, '   ');

  errorTesting('required', schema, undefined);

  errorTesting('required', schema, null);

  expect(schema.safeParse('2024-06-01 12:34:56')).toEqual({
    success: true,
    data: '2024-06-01T12:34:56Z',
  });

  expect(schema.safeParse('2024-06-01T12:34:56+03:00')).toEqual({
    success: true,
    data: '2024-06-01T09:34:56Z',
  });

  const errorNotDatetimeType = errorTesting('not_datetime_type', schema, {});
});

test('Deve ser opcional com sucesso', () => {
  const schema = datetimeUTC().optional();

  const success: any = { success: true };

  expect(schema.safeParse('')).toEqual(success);
  expect(schema.safeParse('   ')).toEqual(success);
  expect(schema.safeParse(undefined)).toEqual(success);
  expect(schema.safeParse(null)).toEqual(success);

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

test('Deve testar min, max e between', () => {
  const minDate = '2024-06-01T12:34:56Z';
  const maxDate = '2024-06-10T12:34:56Z';
  const beforeMin = '2024-05-31T12:34:56Z';
  const afterMax = '2024-06-11T12:34:56Z';
  const betweenDate = '2024-06-05T12:34:56Z';

  const schemaMin = datetimeUTC().min(minDate);
  const schemaMax = datetimeUTC().max(maxDate);
  const schemaBetween = datetimeUTC().between(minDate, maxDate);

  errorTesting('min_datetime', schemaMin, beforeMin);

  expect(schemaMin.safeParse(minDate)).toEqual({
    success: true,
    data: minDate,
  });

  expect(schemaMax.safeParse(maxDate)).toEqual({
    success: true,
    data: maxDate,
  });

  errorTesting('max_datetime', schemaMax, afterMax);

  errorTesting('min_datetime', schemaBetween, beforeMin);

  errorTesting('max_datetime', schemaBetween, afterMax);

  expect(schemaBetween.safeParse(betweenDate)).toEqual({
    success: true,
    data: betweenDate,
  });
});
