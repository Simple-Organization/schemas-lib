/*
 * Funções para achatar (flatten) e desserializar (unflatten) objetos complexos em TypeScript.
 */

type AnyObject = { [key: string]: any };

/**
 * Flatten: transforma um objeto aninhado em um mapa de chaves string para valores.
 * Exemplo: { a: { b: [ { c: 1 } ] } } -> { "a.b.0.c": 1 }
 */
export function flatten(obj: any): Record<string, any> {
  const result: Record<string, any> = {};

  function recurse(curr: any, path: string) {
    if (
      Object(curr) !== curr ||
      curr instanceof Date ||
      curr instanceof RegExp ||
      curr instanceof File
    ) {
      // valor primitivo ou instância não-aninhável
      result[path] = curr;
    } else if (Array.isArray(curr)) {
      // array: iterar índices
      curr.forEach((item, index) => {
        const newPath = path ? `${path}.${index}` : `${index}`;
        recurse(item, newPath);
      });
      if (curr.length === 0) {
        result[path] = [];
      }
    } else {
      // objeto: iterar chaves
      let isEmpty = true;
      for (const key in curr) {
        isEmpty = false;
        const newPath = path ? `${path}.${key}` : key;
        recurse(curr[key], newPath);
      }
      if (isEmpty && path) {
        result[path] = {};
      }
    }
  }

  recurse(obj, '');

  // remover chave vazia
  if (result.hasOwnProperty('')) {
    delete result[''];
  }

  return result;
}

/**
 * Unflatten: reconstrói um objeto a partir de suas chaves string flattened.
 * Exemplo: { "a.b.0.c": 1 } -> { a: { b: [ { c: 1 } ] } }
 *
 * Também aceita FormData como entrada.
 */
export function unflatten(flatObj: Record<string, any> | FormData): AnyObject {
  // Se for FormData, converte para objeto plano
  let flat: Record<string, any>;
  if (typeof FormData !== 'undefined' && flatObj instanceof FormData) {
    flat = {};
    for (const [key, value] of flatObj.entries()) {
      flat[key] = value;
    }
  } else {
    flat = flatObj as Record<string, any>;
  }

  const result: AnyObject = {};

  for (const flatKey in flat) {
    const value = flat[flatKey];
    const pathSegments = flatKey.split('.');
    let curr: any = result;

    pathSegments.forEach((segment, idx) => {
      const isArrayIndex = /^\d+$/.test(segment);
      const key: string | number = isArrayIndex
        ? parseInt(segment, 10)
        : segment;

      if (idx === pathSegments.length - 1) {
        if (isArrayIndex && Array.isArray(curr)) {
          (curr as any[])[key as number] = value;
        } else {
          (curr as AnyObject)[key as string] = value;
        }
      } else {
        const nextIsIndex = /^\d+$/.test(pathSegments[idx + 1]);
        if (isArrayIndex) {
          if (!Array.isArray(curr)) {
            throw new Error(`Esperava array em ${flatKey}`);
          }
          curr[key as number] = curr[key as number] || (nextIsIndex ? [] : {});
          curr = curr[key as number];
        } else {
          curr[key as string] = curr[key as string] || (nextIsIndex ? [] : {});
          curr = curr[key as string];
        }
      }
    });
  }

  return result;
}

/**
 * Flatten: transforma um objeto aninhado em um mapa de chaves string para valores em string
 *
 * Valores null e undefined são convertidos para string vazia.
 *
 * E objetos e arrays vazios são convertidos para string vazia.
 *
 * Tipos File são mantidos como File.
 *
 * Exemplo: { a: { b: [ { c: 1 } ] }, b: null } -> { "a.b.0.c": '1', "b": '' }
 */
export function flattenStr(obj: any): Record<string, string | File> {
  const result: Record<string, string | File> = {};

  function recurse(curr: any, path: string) {
    if (
      Object(curr) !== curr ||
      curr instanceof Date ||
      curr instanceof RegExp
    ) {
      result[path] = curr === null || curr === undefined ? '' : String(curr);
    } else if (curr instanceof File) {
      // Mantém como File
      result[path] = curr;
    } else if (Array.isArray(curr)) {
      // array: iterar índices
      curr.forEach((item, index) => {
        const newPath = path ? `${path}.${index}` : `${index}`;
        recurse(item, newPath);
      });
      if (curr.length === 0) {
        result[path] = '';
      }
    } else {
      // objeto: iterar chaves
      let isEmpty = true;
      for (const key in curr) {
        isEmpty = false;
        const newPath = path ? `${path}.${key}` : key;
        recurse(curr[key], newPath);
      }
      if (isEmpty && path) {
        result[path] = '';
      }
    }
  }

  recurse(obj, '');

  // remover chave vazia
  if (result.hasOwnProperty('')) {
    delete result[''];
  }

  return result;
}
