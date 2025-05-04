import { safeParseError, safeParseSuccess } from '../SchemaLibError';
import { NewSchema, SafeParseReturn } from '../schemas/NewSchema';

//
//

export class NumberSchema extends NewSchema<number> {
  private _min: number | undefined;
  private _max: number | undefined;

  //
  //

  clone(): this {
    const clone = super.clone() as this;
    clone._min = this._min;
    clone._max = this._max;
    return clone;
  }

  //
  //

  _safeParse(originalValue: any): SafeParseReturn<number> {
    let value = originalValue;

    if (typeof value === 'string') {
      value = value.trim();
      if (value === '') {
        value = undefined;
      } else {
        value = Number(value);
      }
    } else if (value === null) {
      value = undefined;
    }

    if (value === undefined) {
      if (this._required) {
        return safeParseError('required', this, originalValue);
      }

      if (this._default) {
        return safeParseSuccess(this._default());
      }

      return safeParseSuccess();
    }

    if (typeof value !== 'number') {
      return safeParseError('not_number_type', this, originalValue);
    }

    if (Number.isNaN(value)) {
      return safeParseError('nan', this, originalValue);
    }

    if (!Number.isFinite(value)) {
      return safeParseError('not_finite', this, originalValue);
    }

    if (this._min && value < this._min) {
      return safeParseError('min_number', this, originalValue);
    }

    if (this._max && value > this._max) {
      return safeParseError('max_number', this, originalValue);
    }

    return safeParseSuccess(value);
  }

  //
  //

  min(value: number): this {
    const clone = this.clone();
    clone._min = value;
    return clone;
  }

  //
  //

  max(value: number): this {
    const clone = this.clone();
    clone._max = value;
    return clone;
  }

  //
  //

  between(min: number, max: number): this {
    const clone = this.clone();
    clone._min = min;
    clone._max = max;
    return clone;
  }
}

export function float(): NumberSchema {
  return new NumberSchema();
}

export function number(): NumberSchema {
  return new NumberSchema();
}
