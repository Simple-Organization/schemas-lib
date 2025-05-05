import { Schema2 } from './Schema2';
import type { ParseContext } from './types';
import { numberPreprocess } from './int2';

//
//

export class NumberSchema2 extends Schema2<number> {
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

NumberSchema2.prototype.preprocess = numberPreprocess;

export function float2(): NumberSchema2 {
  return new NumberSchema2();
}

export function number2(): NumberSchema2 {
  return new NumberSchema2();
}
