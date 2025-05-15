import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';

/**
 * Checa se o valor é um arquivo (File, Blob, Buffer, ou objeto com propriedades de arquivo)
 */
export class FileSchema extends Schema<any> {
  process(p: ParseContext): void {
    const v = p.value;
    // Browser: File ou Blob
    if (
      (typeof File !== 'undefined' && v instanceof File) ||
      (typeof Blob !== 'undefined' && v instanceof Blob)
    ) {
      return;
    }
    // Node.js: Buffer
    if (typeof Buffer !== 'undefined' && v instanceof Buffer) {
      return;
    }
    // Objeto com propriedades típicas de arquivo
    if (
      v &&
      typeof v === 'object' &&
      typeof v.size === 'number' &&
      (typeof v.name === 'string' || typeof v.path === 'string')
    ) {
      return;
    }
    return p.error('not_a_file');
  }
}

/**
 * Cria um schema para arquivos
 */
export function file(): FileSchema {
  return new FileSchema();
}
