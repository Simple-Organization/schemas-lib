import type { Schema } from '../version2/Schema';
import type { ParseContext } from '../version2/types';

//
//

/** Coerce to json if is string */
export function jsonPreprocess(this: Schema<any>, p: ParseContext): void {
  if (typeof p.value === 'string') {
    if (p.value === '') p.value = null;
    else
      try {
        p.value = JSON.parse(p.value);
      } catch {
        return p.error('not_valid_json');
      }
  } else if (p.value === undefined) {
    p.value = null;
  }

  if (p.value === null) {
    if (this.req) {
      return p.error('required');
    }

    if (this.def) {
      p.value = this.def();
      return;
    }
  }
}
