import type { ParseContext } from './types';
import { Schema2 } from './Schema2';

//
//

class IntSchema extends Schema2<number> {
  vMin: number | undefined;
  vMax: number | undefined;

  process(p: ParseContext): void {
    if (typeof p.value !== 'number') {
      return p.error('not_number_type');
    }

    if (Number.isNaN(p.value)) {
      return p.error('nan');
    }

    if (!Number.isInteger(p.value)) {
      return p.error('not_integer');
    }

    if (this.vMin !== undefined && p.value < this.vMin) {
      return p.error('min_number');
    }

    if (this.vMax !== undefined && p.value > this.vMax) {
      return p.error('max_number');
    }
  }

  min(value: number): this {
    this.vMin = value;
    return this;
  }
  max(value: number): this {
    this.vMax = value;
    return this;
  }
  between(min: number, max: number): this {
    this.vMin = min;
    this.vMax = max;
    return this;
  }
}

//
//

IntSchema.prototype.preprocess = numberPreprocess;

//
//

export function numberPreprocess(this: Schema2<number>, p: ParseContext): void {
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

/**
 * Only integer numbers, can be bigger than 32 bits integers
 */
export function int2() {
  return new IntSchema();
}

/**
 * Integer number, must be greater than 0
 */
export function id2() {
  return new IntSchema().min(1);
}
