import { assert } from 'chai';
(globalThis as any).__DEV__ = true;
(globalThis as any).__SERVER__ = true;

assert.equal = assert.strictEqual;
assert.notEqual = assert.notStrictEqual;
assert.deepEqual = assert.deepStrictEqual;
// assert.notDeepEqual = assert.notDeepStrictEqual;
