import type { ISchema } from './version2/types';

export class SchemaLibError {
  readonly value: any;

  constructor(
    readonly code: string,
    readonly owner: ISchema<any>,
    originalValue: any,
  ) {
    this.value = originalValue;
  }

  get message() {
    return this.toString();
  }

  /**
   * Serialize the Issue, in object and array will return a object with the errors
   */
  serialize(): string | Record<string, any> {
    return this.toString();
  }

  toString(): string {
    throw new Error('Not implemented');
  }
}
