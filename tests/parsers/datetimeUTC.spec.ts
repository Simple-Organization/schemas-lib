import { describe, test } from 'mocha';
import { assert } from 'chai';
import { assertSchemaIssue } from '../util';
import { datetimeUTC } from '../../src/parsers/datetimeUTC';

describe('datetimeUTC schema', () => {
  //
  //

  test('Deve executar parse do datetime com sucesso', () => {
    assert.equal(
      datetimeUTC().safeParse('2023-07-20T21:19:25.711Z'),
      '2023-07-20T21:19:25Z',
    );

    // Se receber um objeto do tipo Date, deve converter para string e remover os milisegundos
    assert.equal(
      datetimeUTC().safeParse(new Date('2023-07-20T21:19:25.711Z')),
      '2023-07-20T21:19:25Z',
    );

    assertSchemaIssue(datetimeUTC(), 'not_utc_datetime_string', 'aaaa');
    assertSchemaIssue(datetimeUTC(), 'datetime_out_range', 0); // Will convert to 1970
    assertSchemaIssue(
      datetimeUTC(),
      'datetime_out_range',
      '2010-07-20T21:19:25Z',
    ); // Considered wrong because is smaller than 2015
    assertSchemaIssue(
      datetimeUTC(),
      'datetime_out_range',
      '2031-07-20T21:19:25Z',
    ); // Considered wrong because is bigger than 2030
  });

  //
  //

  test("Deve manter errado caso não execute o 'ensure'", () => {
    const ensureFalse = datetimeUTC().ensure(false);

    assert.equal(
      ensureFalse.safeParse('2023-00-00T00:00:00.000Z'),
      '2023-00-00T00:00:00Z',
    );

    // Se receber um objeto do tipo Date, deve converter para string e remover os milisegundos
    assert.throws(() => {
      ensureFalse.safeParse(new Date('2023-00-00T00:00:00.000Z'));
    });
  });

  //
  //

  test("Deve aceitar datas maiores ou menores caso 'closeCurrent' seja false", () => {
    const closeCurrentFalse = datetimeUTC().closeCurrent(false);

    assert.equal(
      closeCurrentFalse.safeParse('1975-07-20T21:19:25Z'),
      '1975-07-20T21:19:25Z',
    );

    assert.equal(
      closeCurrentFalse.safeParse('2035-07-20T21:19:25Z'),
      '2035-07-20T21:19:25Z',
    );
  });
});
