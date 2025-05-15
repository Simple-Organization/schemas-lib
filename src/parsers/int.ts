import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';
import { numberPreprocess } from '../preprocess/numberPreprocess';

//
//

class IntSchema extends Schema<number> {
  vMin?: number | undefined;
  vMax?: number | undefined;

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

/**
 * Only integer numbers, can be bigger than 32 bits integers
 */
export function int() {
  return new IntSchema();
}

/**
 * Integer number, must be greater than 0
 */
export function id() {
  return new IntSchema().min(1);
}
