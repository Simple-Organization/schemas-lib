import { test, expect } from 'bun:test';
import { any } from './any';
import { errorTesting } from '../utils/error';

//
//

test('Deve executar o safeParse com sucesso', () => {
  const schema = any();

  expect(schema.safeParse(1)).toEqual({
    success: true,
    data: 1,
  });

  expect(schema.safeParse('1')).toEqual({
    success: true,
    data: '1',
  });

  expect(schema.safeParse('1aaaa')).toEqual({
    success: true,
    data: '1aaaa',
  });

  expect(schema.safeParse(true)).toEqual({
    success: true,
    data: true,
  });

  expect(schema.safeParse(new Set())).toEqual({
    success: true,
    data: new Set(),
  });

  expect(schema.safeParse(['1'])).toEqual({
    success: true,
    data: ['1'],
  });
});
