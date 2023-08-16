import { describe, test } from 'mocha';
import { assert } from 'chai';
import {
  validarCNPJ,
  validarCPF,
  validarRG,
} from '../../src/others/valida_cpf_cnpj';
import { cpf_cnpj } from '../../src';

describe('Validar cpf cnpj', () => {
  //
  //

  test('Deve validar alguns CPFs com sucesso', () => {
    assert.equal(validarCPF('111.444.777-35'), true);
    assert.equal(validarCPF('11144477735'), true);
    assert.equal(validarCPF('1.1.1.4...44.77...73-5'), true);
    assert.equal(validarCPF('123.456.789-09'), true);

    assert.equal(validarCPF('000.000.000-00'), false);
    assert.equal(validarCPF('111.444.7a77-35'), false);
    assert.equal(validarCPF('1'), false);
  });

  //
  //

  test('Deve validar alguns CNPJ com sucesso', () => {
    assert.equal(validarCNPJ('26.234.788/0001-94'), true);
    assert.equal(validarCNPJ('11.444.777/0001-61'), true);
    assert.equal(validarCNPJ('1////14...44777000161'), true);

    assert.equal(validarCNPJ('12.345.678/0001-90'), false);
    assert.equal(validarCNPJ('00.000.000/0000-00'), false);
    assert.equal(validarCNPJ('26.234.788/00a01-94'), false);
    assert.equal(validarCNPJ('1'), false);
  });

  //
  //

  test.skip('Deve validar alguns RG com sucesso', () => {
    assert.equal(validarRG('39.935.975-8'), true);
    assert.equal(validarRG('43.652.912-9'), true);

    assert.equal(validarRG('43.652.9aa-9'), false);
    assert.equal(validarRG('43.652.9-9'), false);
  });

  //
  //

  test('cpf_cnpj schema deve fazer o parse com sucesso', () => {
    assert.equal(
      cpf_cnpj.tsafeParse('11.444.777/0001-61'),
      '11.444.777/0001-61',
    );
    assert.equal(cpf_cnpj.tsafeParse('11444777000161'), '11.444.777/0001-61');

    assert.equal(cpf_cnpj.tsafeParse('111.444.777-35'), '111.444.777-35');
    assert.equal(cpf_cnpj.tsafeParse('11144477735'), '111.444.777-35');

    assert.throw(() => cpf_cnpj.parse('aaaaa'));
  });
});
