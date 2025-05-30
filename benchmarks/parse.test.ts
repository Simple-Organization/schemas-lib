import { Bench } from 'tinybench';
import { describe, test } from 'bun:test';
import { s } from '../src';
import z from 'zod';

//
//

describe.skip('Parse benchmark', () => {
  //
  //

  test('1 - Parse Zod vs schemas-lib', async () => {
    const userSchemaLib = s.object({
      name: s.string().optional(),
      age: s.number().optional(),
      email: s.email(),
      isActive: s.boolean().optional(),
      tags: s.array(s.string().optional()).optional(),
    });

    const userZod = z.object({
      name: z.string().nullish(),
      age: z.number().nullish(),
      email: z.email().nullish(),
      isActive: z.boolean().nullish(),
      tags: z.array(z.string().nullish()).nullish(),
    });

    const bench = new Bench();

    const validData = {
      name: 'João',
      age: 30,
      email: 'joao@email.com',
      isActive: true,
      tags: ['dev', 'typescript'],
    };

    bench
      .add('Zod', () => {
        userZod.safeParse(validData);
      })
      .add('SchemasLib', () => {
        userSchemaLib.safeParse(validData);
      });

    await bench.run();

    console.table(bench.table());
  }, 600000);

  //
  //

  test('2 - Parse Zod vs schemas-lib', async () => {
    const userSchemaLib1 = s.object({
      id: s.id().optional(),
    });

    const userZod = z.object({
      id: z.number().int().min(1).nullish(),
    });

    const bench = new Bench();

    const validData = {
      name: 'João',
      age: 30,
      email: 'joao@email.com',
      isActive: true,
      tags: ['dev', 'typescript'],
    };

    bench
      .add('Zod', () => {
        userZod.safeParse(validData);
      })
      .add('SchemasLib 1', () => {
        userSchemaLib1.safeParse(validData);
      });

    await bench.run();

    console.table(bench.table());
  }, 600000);

  //
  //

  test('3 - Parse Zod vs schemas-lib', async () => {
    const userSchemaLib1 = s.id();

    const userZod1 = z.number().int().min(1).nullish();
    const userZod2 = z.number();

    const bench = new Bench();

    bench
      .add('Zod 1', () => {
        userZod1.safeParse(1);
      })
      .add('Zod 2 (number only)', () => {
        userZod2.safeParse(1);
      })
      .add('SchemasLib 1', () => {
        userSchemaLib1.safeParse(1);
      });

    await bench.run();

    console.table(bench.table());
  }, 600000);
});
