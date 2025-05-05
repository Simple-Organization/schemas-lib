import type { SchemaMeta } from './version2/types';
import { validationErrors } from './validationErrors';

export class Issue {
  readonly value: any;

  constructor(
    readonly code: string,
    readonly meta: SchemaMeta,
    originalValue: any,
  ) {
    this.value = originalValue;

    if (code !== 'custom' && validationErrors[code] === undefined) {
      throw new Error(`Validation error "${code}" not found`);
    }
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

  toString() {
    if (this.meta.errors && this.meta.errors[this.code]) {
      const error = this.meta.errors[this.code];

      if (typeof error === 'function') {
        return error(this.value, this.meta);
      }

      return error;
    }

    const error = validationErrors[this.code];

    if (typeof error === 'function') {
      return error(this.value, this.meta);
    }

    return error;
  }
}

//
//

/**
 * Issue used by ObjectSchema and ArraySchema
 */
export class ObjectIssue extends Issue {
  readonly errors: Record<string, Issue> = {};

  serialize() {
    const errors: Record<string, any> = {};

    for (const key of Object.keys(this.errors)) {
      errors[key] = this.errors[key].serialize();
    }

    return errors;
  }

  toString() {
    return JSON.stringify(this.serialize());
  }
}

//
//

export class IssueError extends Error {
  readonly value: any;

  constructor(readonly issue: Issue) {
    super();
  }

  get message() {
    return this.issue.toString();
  }

  /**
   * Serialize the Issue, in object and array will return a object with the errors
   */
  serialize(): string | Record<string, any> {
    return this.issue.serialize();
  }

  toString() {
    return this.issue.toString();
  }
}

//
//

export class CustomIssue extends Issue {
  constructor(
    readonly custom: string,
    meta: SchemaMeta,
    originalValue: any,
  ) {
    super('custom', meta, originalValue);
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

  toString() {
    return this.custom;
  }
}
