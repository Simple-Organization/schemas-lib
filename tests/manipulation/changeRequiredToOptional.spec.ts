import { describe, test } from 'mocha';
import { int, nameField } from '../../src';
import { changeRequiredToOptional } from '../../src/manipulation/changeRequiredToOptional';
import { assert } from 'chai';

//
//

describe('changeRequiredToOptional', () => {
  test('should convert all required properties to optional', () => {
    const shape = {
      name: nameField,
      age: int().between(0, 140),
    };

    const result = changeRequiredToOptional(shape);

    assert.equal(result.shape.name.meta.mode, 'optional');
    assert.equal(result.shape.age.meta.mode, 'optional');
  });

  test('should convert all nullable properties to nullish', () => {
    const shape = {
      name: nameField.nullable(),
      age: int().between(0, 140).nullable(),
    };

    const result = changeRequiredToOptional(shape);

    assert.equal(result.shape.name.meta.mode, 'nullish');
    assert.equal(result.shape.age.meta.mode, 'nullish');
  });
});
