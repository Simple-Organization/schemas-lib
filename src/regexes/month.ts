import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';

//
//

export class MonthSchema extends Schema<string> {
  process(p: ParseContext): void {
    if (typeof p.value !== 'string') return p.error('not_string_type');

    if (!/^\d{4}-\d{2}$/.test(p.value)) {
      return p.error('not_month', p.value);
    }

    const date = new Date(p.value);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 7) !== p.value
    ) {
      return p.error('not_month', p.value);
    }
  }
}

/**
 * Month
 */
export function month() {
  return new MonthSchema();
}
