import { describe, test } from 'mocha';
import { assert } from 'chai';
import { int, object, trimmed } from '../../src';
import { array } from '../../src/parsers/array';
import { partialUpdateObj } from '../../src/manipulation/partialUpdateObj';

describe('partialUpdateObj schema', () => {
  //
  //

  test('Deve ser gerado o object partial com sucesso', () => {
    const obj = object({
      id: int,
      name: trimmed,
      tags: array(int),
    });

    const partial = partialUpdateObj(
      {
        id: obj.shape.id,
      },
      {
        name: obj.shape.name,
        tags: obj.shape.tags,
      },
    );

    assert.equal(
      partial.meta.jsType,
      '{"id":number;"name"?:string;"tags"?:(number)[]}',
    );

    assert.equal(partial.shape.id.meta.mode, undefined);
    assert.equal(partial.shape.name.meta.mode, 'optional');
    assert.equal(partial.shape.tags.meta.mode, 'optional');
  });

  //
  //

  test('Deve ser gerado o object partial com nullable e nullsih com sucesso', () => {
    const obj = object({
      id: int,
      name: trimmed.required(),
      tags: array(int).nullable(),
      obs: trimmed.nullish(),
      outro: trimmed.optional(),
    });

    const partial = partialUpdateObj(
      {
        id: obj.shape.id,
      },
      {
        name: obj.shape.name,
        tags: obj.shape.tags,
        obs: obj.shape.obs,
        outro: obj.shape.outro,
      },
    );

    assert.equal(
      partial.meta.jsType,
      '{"id":number;"name"?:string;"tags"?:(number)[]|null;"obs"?:string|null;"outro"?:string}',
    );

    assert.equal(partial.shape.id.meta.mode, undefined);
    assert.equal(partial.shape.name.meta.mode, 'optional');
    assert.equal(partial.shape.tags.meta.mode, 'nullish');
    assert.equal(partial.shape.obs.meta.mode, 'nullish');
    assert.equal(partial.shape.outro.meta.mode, 'optional');
  });
});
