export function validarCPF(cpf: string): boolean {
  if (/[^0-9\-.]/.test(cpf)) {
    return false;
  }

  // Removendo caracteres não numéricos
  cpf = cpf.replace(/[-\.]/g, '');

  // Verificando se o CPF possui 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Verificando se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Calculando o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto < 10 ? resto : 0;

  // Verificando o primeiro dígito verificador
  if (digito1 !== parseInt(cpf.charAt(9))) {
    return false;
  }

  // Calculando o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto < 10 ? resto : 0;

  // Verificando o segundo dígito verificador
  if (digito2 !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

//
//

export function validarCNPJ(cnpj: string): boolean {
  if (/[^0-9\-./]/.test(cnpj)) {
    return false;
  }

  // Removendo caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, '');

  // Verificando se o CNPJ possui 14 dígitos
  if (cnpj.length !== 14) {
    return false;
  }

  // Verificando se todos os dígitos são iguais (CNPJ inválido)
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // Calculando o primeiro dígito verificador
  let soma = 0;
  let peso = 2;
  for (let i = 11; i >= 0; i--) {
    soma += parseInt(cnpj.charAt(i)) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;

  // Verificando o primeiro dígito verificador
  if (digito1 !== parseInt(cnpj.charAt(12))) {
    return false;
  }

  // Calculando o segundo dígito verificador
  soma = 0;
  peso = 2;
  for (let i = 12; i >= 0; i--) {
    soma += parseInt(cnpj.charAt(i)) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;

  // Verificando o segundo dígito verificador
  if (digito2 !== parseInt(cnpj.charAt(13))) {
    return false;
  }

  return true;
}

//
//

export function validarRG(rg: string): boolean {
  if (/[^0-9\-.]/.test(rg)) {
    return false;
  }

  // Removendo caracteres não numéricos
  rg = rg.replace(/\D/g, '');

  // Verificando se o RG possui pelo menos 4 dígitos
  if (rg.length < 4) {
    return false;
  }

  // Verificando se todos os dígitos são iguais (RG inválido)
  if (/^(\d)\1+$/.test(rg)) {
    return false;
  }

  return true;
}

//
//

export function formatarCPF(cpf: string): string {
  const parte1 = cpf.slice(0, 3);
  const parte2 = cpf.slice(3, 6);
  const parte3 = cpf.slice(6, 9);
  const parte4 = cpf.slice(9, 11);

  return `${parte1}.${parte2}.${parte3}-${parte4}`;
}

//
//

export function formatCNPJ(cnpj: string): string {
  // Aplicar a formatação do CNPJ: XX.XXX.XXX/XXXX-XX
  return (
    cnpj.slice(0, 2) +
    '.' +
    cnpj.slice(2, 5) +
    '.' +
    cnpj.slice(5, 8) +
    '/' +
    cnpj.slice(8, 12) +
    '-' +
    cnpj.slice(12)
  );
}
