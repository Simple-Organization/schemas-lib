import type { ParseContext } from '../version2/types';
import { Schema } from '../version2/Schema';
import { numberPreprocess } from '../preprocess/numberPreprocess';

//
//

export class NumberSchema extends Schema<number> {
  vMin: number | undefined;
  vMax: number | undefined;

  process(p: ParseContext): void {
    if (typeof p.value !== 'number') {
      return p.error('not_number_type');
    }

    if (Number.isNaN(p.value)) {
      return p.error('nan');
    }

    if (!Number.isFinite(p.value)) {
      return p.error('not_finite');
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

NumberSchema.prototype.preprocess = numberPreprocess;

export function float(): NumberSchema {
  return new NumberSchema();
}

export function number(): NumberSchema {
  return new NumberSchema();
}

/** Campo dinheiro em reais */
export function dinheiro(): NumberSchema {
  return new NumberSchema();
}
