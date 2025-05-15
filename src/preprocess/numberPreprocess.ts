import type { Schema, ParseContext } from '../version2/types';

//
//

export function numberPreprocess(this: Schema<number>, p: ParseContext): void {
  if (typeof p.value === 'string') {
    p.value = p.value.trim();

    if (p.value === '') {
      p.value = null;
    } else {
      p.value = Number(p.value);
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
