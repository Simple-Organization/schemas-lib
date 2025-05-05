import { test, expect } from 'bun:test';
import { formatarCPF, validarCPF } from './cpf';
import { formatCNPJ, validarCNPJ } from './cnpj';
import { formatarRG, validarRG } from './rg';

test('validarCPF - CPFs válidos', () => {
  expect(validarCPF('529.982.247-25')).toBe(true);
  expect(validarCPF('52998224725')).toBe(true);
});

test('validarCPF - CPFs inválidos', () => {
  expect(validarCPF('111.111.111-11')).toBe(false);
  expect(validarCPF('123.456.789-00')).toBe(false);
  expect(validarCPF('529.982.247-24')).toBe(false);
  expect(validarCPF('')).toBe(false);
  expect(validarCPF('abc.def.ghi-jk')).toBe(false);
});

test('validarCNPJ - CNPJs válidos', () => {
  expect(validarCNPJ('04.252.011/0001-10')).toBe(true);
  expect(validarCNPJ('04252011000110')).toBe(true);
});

test('validarCNPJ - CNPJs inválidos', () => {
  expect(validarCNPJ('11.111.111/1111-11')).toBe(false);
  expect(validarCNPJ('04.252.011/0001-11')).toBe(false);
  expect(validarCNPJ('')).toBe(false);
  expect(validarCNPJ('abcd.efgh/ijkl-mn')).toBe(false);
});

test('validarRG - RGs válidos', () => {
  expect(validarRG('12.345.678-9')).toBe(true);
  expect(validarRG('123456789')).toBe(true);
  expect(validarRG('1234')).toBe(true);
});

test('validarRG - RGs inválidos', () => {
  expect(validarRG('11111111')).toBe(false);
  expect(validarRG('abc.def.ghi-j')).toBe(false);
  expect(validarRG('123')).toBe(false);
  expect(validarRG('')).toBe(false);
});

test('formatarCPF', () => {
  expect(formatarCPF('52998224725')).toBe('529.982.247-25');
});

test('formatCNPJ', () => {
  expect(formatCNPJ('04252011000110')).toBe('04.252.011/0001-10');
});

test('formatarRG', () => {
  expect(formatarRG('208229048')).toBe('20.822.904-8');
  expect(formatarRG('28.034.332-2')).toBe('28.034.332-2');
});
