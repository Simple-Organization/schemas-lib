import type { ParseContext } from '../version2/types';
import type { Schema } from '../version2/Schema';
import { EMPTY_VALUE } from '../symbols';

//
//

export function trimPreprocess(this: Schema<number>, p: ParseContext): void {
  if (typeof p.value === 'string') {
    p.value = p.value.trim();

    if (p.value === '') {
      p.value = EMPTY_VALUE;
    }
  } else if (p.value === undefined) {
    p.value = EMPTY_VALUE;
  } else if (p.value === null) {
    p.value = EMPTY_VALUE;
  }
}
