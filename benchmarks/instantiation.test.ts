import { Bench } from 'tinybench';
import { describe, test } from 'bun:test';
import { s } from '../src';
import z from 'zod';

//
//

describe.skip('Instanciation benchmark', () => {
  //
  //

  test('1 - Instanciation Zod vs schemas-lib', async () => {
    const userSchemaLib = () =>
      s.object({
        name: s.string().optional(),
        age: s.number().optional(),
        email: s.email().optional(),
        isActive: s.boolean().optional(),
        tags: s.array(s.string().optional()).optional(),
      });

    const userZod = () =>
      z.object({
        name: z.string().nullish(),
        age: z.number().nullish(),
        email: z.email().nullish(),
        isActive: z.boolean().nullish(),
        tags: z.array(z.string().nullish()).nullish(),
      });

    const bench = new Bench();

    bench
      .add('Zod', () => {
        userZod();
      })
      .add('SchemasLib', () => {
        userSchemaLib();
      });

    await bench.run();

    console.table(bench.table());
  }, 600000);

  //
  //

  test('2 - Instanciation Zod vs schemas-lib', async () => {
    const userSchemaLib = () =>
      s.object({
        name: s.string(),
        age: s.number(),
        email: s.email(),
        isActive: s.boolean(),
        tags: s.array(s.string()),
      });

    const userZod = () =>
      z.object({
        name: z.string(),
        age: z.number(),
        email: z.email(),
        isActive: z.boolean(),
        tags: z.array(z.string()),
      });

    const bench = new Bench();

    bench
      .add('Zod', () => {
        userZod();
      })
      .add('SchemasLib', () => {
        userSchemaLib();
      });

    await bench.run();

    console.table(bench.table());
  }, 600000);
});
