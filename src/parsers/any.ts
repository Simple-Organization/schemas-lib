import { EMPTY_VALUE } from '../symbols';
import { Schema } from '../version2/Schema';

//
//

class AnySchema extends Schema<any> {
  def = EMPTY_VALUE as any;
  preprocess(): void {}
  process(): void {}
}

/**
 * Any value, no validation
 * This schema is used to skip validation
 */
export function any() {
  return new AnySchema();
}
