import { Issue } from './Issue';
import {
  formatCNPJ,
  formatarCPF,
  validarCNPJ,
  validarCPF,
} from './others/valida_cpf_cnpj';
import { int } from './parsers/int';
import { trimmed } from './parsers/string';

//
// Ids

export const id = () => int().min(1);

//
//

export function url() {
  return trimmed().addParser(function urlParser(value, meta, originalValue) {
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
  });
}

/**
 * Similar to int, but keeps the left zeros
 */
export function intString() {
  return trimmed().addParser(
    function stringIntParser(value, meta, originalValue) {
      if (!/^\d+$/.test(value)) {
        return new Issue('not_integer', meta, originalValue);
      }

      return value;
    },
  );
}

//
//  Email - Created by Copilot
//  very simple email regex, probably not the best
export function email() {
  return trimmed().addParser(function emailParser(value, meta, originalValue) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return new Issue('not_email', meta, originalValue);
    }

    return value;
  });
}

//
//  Date - Created by Copilot
//  very simple date regex, probably not the best
export function date() {
  return trimmed().addParser(function dateParser(value, meta, originalValue) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Issue('not_date', meta, originalValue);
    }

    return value;
  });
}

/**
 * Must start with a letter
 *
 * Can have letters, numbers and spaces
 */
export function nameField() {
  return trimmed().addParser(
    function nameFieldParser(value, meta, originalValue) {
      if (!/^[a-zA-Z\u00C0-\u00FF]{2}[a-zA-Z\u00C0-\u00FF0-9 ]*$/.test(value)) {
        return new Issue('not_namefield', meta, originalValue);
      }

      return value;
    },
  );
}

export function cpf() {
  return trimmed().addParser(function cpfParser(value, meta, originalValue) {
    if (validarCPF(value)) {
      return formatarCPF(value.replace(/\D/g, ''));
    }

    return new Issue('not_cpf', meta, originalValue);
  });
}

export function cnpj() {
  return trimmed().addParser(function cnpjParser(meta, originalValue, value) {
    if (validarCNPJ(value)) {
      return formatCNPJ(value.replace(/\D/g, ''));
    }

    return new Issue('not_cnpj', meta, originalValue);
  });
}
