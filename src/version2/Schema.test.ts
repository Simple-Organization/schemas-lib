import { test, expect } from 'bun:test';
import { Schema } from './Schema';

//
//

class TestSchema extends Schema<string> {
  process(): void {}
}

//
//

test('Deve transformar o valor com sucesso', () => {
  const schema = new TestSchema().transform((value) => {
    return value + '1';
  });

  expect(schema.safeParse('2')).toEqual({ success: true, data: '21' });
  expect(schema.safeParse('aaaa')).toEqual({ success: true, data: 'aaaa1' });
});
