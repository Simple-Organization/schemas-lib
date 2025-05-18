import type { Schema } from '../version2/Schema';
import type { ParseContext } from '../version2/types';
import { EMPTY_VALUE } from '../symbols';

//
//

/** Coerce to json if is string */
export function jsonPreprocess(this: Schema<any>, p: ParseContext): void {
  if (typeof p.value === 'string') {
    if (p.value === '') p.value = EMPTY_VALUE;
    else
      try {
        p.value = JSON.parse(p.value);

        if (p.value === null) p.value = EMPTY_VALUE;
      } catch {
        return p.error('not_valid_json');
      }
  } else if (p.value === undefined) {
    p.value = EMPTY_VALUE;
  } else if (p.value === null) {
    p.value = EMPTY_VALUE;
  }
}
