import type { Issue } from './version2/types';

//
//

export class SchemaLibError {
  constructor(readonly issues: Issue[]) {}

  get message() {
    return this.toString();
  }

  /**
   * Inspirado no z.prettifyError
   */
  prettifyError(): string {
    //
    throw new Error('not implemented');
  }

  toString(): string {
    return this.prettifyError();
  }
}
