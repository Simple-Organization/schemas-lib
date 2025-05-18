import { test, expect } from 'bun:test';
import { record } from './record';
import { int } from './int';
import { errorTesting } from '../utils/error';

// Testa safeParse com sucesso
test('Deve executar o safeParse com sucesso', () => {
  const schema = record(int());

  expect(schema.safeParse({ a: 1, b: 2 })).toEqual({
    success: true,
    data: { a: 1, b: 2 },
  });

  expect(schema.safeParse({})).toEqual({
    success: true,
    data: {},
  });

  expect(schema.safeParse('{"a":1,"b":2}')).toEqual({
    success: true,
    data: { a: 1, b: 2 },
  });

  errorTesting('not_object', schema, 123);
  errorTesting('not_object', schema, []);
  errorTesting('required', schema, null);
  errorTesting('required', schema, undefined);
});

// Testa valores inválidos nos itens do record
test('Deve retornar erro para valores inválidos', () => {
  const schema = record(int());

  errorTesting('nan', schema, { a: 'foo' });
  errorTesting('nan', schema, { a: 1, b: 'bar' });
});

//
//

test('Valores vazios devem ser considerados undefined', () => {
  const schema = record(int());

  // Valores vazios são tratados como undefined
  expect(schema.safeParse({ a: 1, b: undefined, c: null, d: '' })).toEqual({
    success: true,
    data: { a: 1 },
  });
});

// Testa record aninhado
test('Deve fazer parse de record aninhado', () => {
  const schema = record(record(int()));

  expect(schema.safeParse({ a: { x: 1 }, b: { y: 2 } })).toEqual({
    success: true,
    data: { a: { x: 1 }, b: { y: 2 } },
  });

  errorTesting('nan', schema, { a: { x: 'foo' } });
});

//
test('Não deve funcionar com nan', () => {
  const schema = record(int());

  errorTesting('nan', schema, { a: 'foo' });
});

// Testa record vazio
test('Deve aceitar objeto vazio', () => {
  const schema = record(int());
  expect(schema.safeParse({})).toEqual({
    success: true,
    data: {},
  });
});
