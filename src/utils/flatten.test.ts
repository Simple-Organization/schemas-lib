import { expect, test } from 'bun:test';
import { flatten, unflatten, flattenStr } from './flatten';

test('flatten: objeto simples', () => {
  const obj = { a: 1, b: 2 };
  expect(flatten(obj)).toEqual({ a: 1, b: 2 });
});

test('flatten: objeto aninhado', () => {
  const obj = { a: { b: { c: 3 } } };
  expect(flatten(obj)).toEqual({ 'a.b.c': 3 });
});

test('flatten: array aninhado', () => {
  const obj = { a: [{ b: 1 }, { b: 2 }] };
  expect(flatten(obj)).toEqual({ 'a.0.b': 1, 'a.1.b': 2 });
});

test('flatten: array vazio', () => {
  const obj = { a: [] };
  expect(flatten(obj)).toEqual({ a: [] });
});

test('flatten: objeto vazio', () => {
  const obj = { a: {} };
  expect(flatten(obj)).toEqual({ a: {} });
});

test('flatten: valores primitivos', () => {
  const obj = { a: 1, b: null, c: undefined, d: 'x' };
  expect(flatten(obj)).toEqual({ a: 1, b: null, c: undefined, d: 'x' });
});

test('flatten: datas e regex', () => {
  const date = new Date();
  const regex = /abc/;
  const obj = { a: date, b: regex };
  expect(flatten(obj)).toEqual({ a: date, b: regex });
});

test('flatten: File', () => {
  const file = new File(['conteúdo'], 'teste.txt', { type: 'text/plain' });
  const obj = { arquivo: { file } };
  expect(flatten(obj)).toEqual({ 'arquivo.file': file });
});

test('unflatten: objeto simples', () => {
  const flat = { a: 1, b: 2 };
  expect(unflatten(flat)).toEqual({ a: 1, b: 2 });
});

test('unflatten: objeto aninhado', () => {
  const flat = { 'a.b.c': 3 };
  expect(unflatten(flat)).toEqual({ a: { b: { c: 3 } } });
});

test('unflatten: array aninhado', () => {
  const flat = { 'a.0.b': 1, 'a.1.b': 2 };
  expect(unflatten(flat)).toEqual({ a: [{ b: 1 }, { b: 2 }] });
});

test('unflatten: array vazio', () => {
  const flat = { a: [] };
  expect(unflatten(flat)).toEqual({ a: [] });
});

test('unflatten: objeto vazio', () => {
  const flat = { a: {} };
  expect(unflatten(flat)).toEqual({ a: {} });
});

test('flatten/unflatten: inverso', () => {
  const obj = { a: { b: [{ c: 1 }, { d: 2 }] }, e: null };
  expect(unflatten(flatten(obj))).toEqual(obj);
});

//
//

test('flattenStr: objeto simples', () => {
  const obj = { a: 1, b: 2 };
  expect(flattenStr(obj)).toEqual({ a: '1', b: '2' });
});

test('flattenStr: objeto aninhado', () => {
  const obj = { a: { b: { c: 3 } } };
  expect(flattenStr(obj)).toEqual({ 'a.b.c': '3' });
});

test('flattenStr: array aninhado', () => {
  const obj = { a: [{ b: 1 }, { b: 2 }] };
  expect(flattenStr(obj)).toEqual({ 'a.0.b': '1', 'a.1.b': '2' });
});

test('flattenStr: array vazio', () => {
  const obj = { a: [] };
  expect(flattenStr(obj)).toEqual({ a: '' });
});

test('flattenStr: objeto vazio', () => {
  const obj = { a: {} };
  expect(flattenStr(obj)).toEqual({ a: '' });
});

test('flattenStr: valores primitivos', () => {
  const obj = { a: 1, b: null, c: undefined, d: 'x' };
  expect(flattenStr(obj)).toEqual({ a: '1', b: '', c: '', d: 'x' });
});

test('flattenStr: datas e regex', () => {
  const date = new Date();
  const regex = /abc/;
  const obj = { a: date, b: regex };
  expect(flattenStr(obj)).toEqual({ a: String(date), b: String(regex) });
});

test('flattenStr: File', () => {
  const file = new File(['conteúdo'], 'teste.txt', { type: 'text/plain' });
  const obj = { arquivo: { file } };
  expect(flattenStr(obj)).toEqual({ 'arquivo.file': String(file) });
});
