import { Issue } from './Issue';
import {
  formatCNPJ,
  formatarCPF,
  validarCNPJ,
  validarCPF,
} from './others/valida_cpf_cnpj';
import { int } from './parsers/int';
import { mixin } from './parsers/mixin';
import { trimmed } from './parsers/string';

//
// Ids

export const id = /* @__PURE__ */ int.min(1);

//
//

export const url = /* @__PURE__ */ trimmed.addParser(
  function urlParser(value, meta, originalValue) {
    try {
      if (typeof value !== 'string') {
        return new Issue('not_url', meta, originalValue);
      }

      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        value = 'http://' + value;
      }

      new URL(value);
    } catch (_) {
      return new Issue('not_url', meta, originalValue);
    }
    return value;
  },
);

/**
 * Similar to int, but keeps the left zeros
 */
export const intString = /* @__PURE__ */ trimmed.addParser(
  function stringIntParser(value, meta, originalValue) {
    if (!/^\d+$/.test(value)) {
      return new Issue('not_integer', meta, originalValue);
    }

    return value;
  },
);

//
//  Email - Created by Copilot
//  very simple email regex, probably not the best

export const email = /* @__PURE__ */ trimmed.addParser(
  function emailParser(value, meta, originalValue) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return new Issue('not_email', meta, originalValue);
    }

    return value;
  },
);

//
//  Date - Created by Copilot
//  very simple date regex, probably not the best

export const date = /* @__PURE__ */ trimmed.addParser(
  function dateParser(value, meta, originalValue) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Issue('not_date', meta, originalValue);
    }

    return value;
  },
);

/**
 * Must start with a letter
 *
 * Can have letters, numbers and spaces
 */
export const nameField = /* @__PURE__ */ trimmed.addParser(
  function nameFieldParser(value, meta, originalValue) {
    if (!/^[a-zA-Z\u00C0-\u00FF]{2}[a-zA-Z\u00C0-\u00FF0-9 ]*$/.test(value)) {
      return new Issue('not_namefield', meta, originalValue);
    }

    return value;
  },
);

export const cpf = /* @__PURE__ */ trimmed.addParser(
  function cpfParser(value, meta, originalValue) {
    if (validarCPF(value)) {
      return formatarCPF(value.replace(/\D/g, ''));
    }

    return new Issue('not_cpf', meta, originalValue);
  },
);

export const cnpj = /* @__PURE__ */ trimmed.addParser(
  function cnpjParser(meta, originalValue, value) {
    if (validarCNPJ(value)) {
      return formatCNPJ(value.replace(/\D/g, ''));
    }

    return new Issue('not_cnpj', meta, originalValue);
  },
);

/**
 * CPF or CNPJ validation
 */
export const cpf_cnpj = /* @__PURE__ */ mixin([cpf, cnpj]);
