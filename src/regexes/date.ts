import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';
import { trimPreprocess } from '../preprocess/trimPreprocess';

//
//

export class DateSchema extends Schema<string> {
  process(p: ParseContext): void {
    if (typeof p.value !== 'string') return p.error('not_string_type');

    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.value)) {
      return p.error('not_date', p.value);
    }

    const date = new Date(p.value);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== p.value
    ) {
      return p.error('not_date', p.value);
    }
  }
}

DateSchema.prototype.preprocess = trimPreprocess;

/**
 * Date
 */
export function date() {
  return new DateSchema();
}
