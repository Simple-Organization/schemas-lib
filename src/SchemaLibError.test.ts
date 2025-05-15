import { test, expect } from 'bun:test';
import { array, int, nome, object } from './s';

//
//

test('Deve fazer .prettifyError() com sucesso de um elemento', () => {
  const schema = int();
  const error = schema.safeParse('a');
  const prettifyError = error.error!.prettifyError();
  expect(prettifyError).toEqual('O campo não é um número válido');
});

//
//

test('Deve fazer .prettifyError() com sucesso de um array', () => {
  const schema = array(int());
  const error = schema.safeParse(['a']);
  const prettifyError = error.error!.prettifyError();
  expect(prettifyError).toEqual('0: O campo não é um número válido');
});

//
//

test('Deve fazer .prettifyError() com sucesso de um array com vários elementos', () => {
  const schema = array(int());
  const error = schema.safeParse(['a', 'b', 'c']);
  const prettifyError = error.error!.prettifyError();
  expect(prettifyError).toEqual(
    '0: O campo não é um número válido\n1: O campo não é um número válido\n2: O campo não é um número válido',
  );
});

//
//

test('Deve fazer .prettifyError() com sucesso de um objeto', () => {
  const schema = object({ id: int() });
  const error = schema.safeParse({ id: 'a' });
  const prettifyError = error.error!.prettifyError();
  expect(prettifyError).toEqual('id: O campo não é um número válido');
});

//
//

test('Deve fazer .prettifyError() com sucesso de um objeto com vários indices', () => {
  const schema = object({ id: int(), name: nome(), age: int() });
  const error = schema.safeParse({ id: 'a', name: 1, age: 'a' });
  const prettifyError = error.error!.prettifyError();
  expect(prettifyError).toEqual(
    'id: O campo não é um número válido\nname: O campo não é uma string\nage: O campo não é um número válido',
  );
});
