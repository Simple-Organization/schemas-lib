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
    return this.issues
      .map((issue) => {
        if (issue.path.length > 0) {
          return `${issue.path.join('.')}: ${issue.message}`;
        }
        return issue.message;
      })
      .join('\n');
  }

  toString(): string {
    return this.prettifyError();
  }
}
