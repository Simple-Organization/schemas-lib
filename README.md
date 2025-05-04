# schemas-lib

## Table of contents

Table of contents

- [Introdução](#introdução)
- [Diferenças com outras libs](#diferenças-com-outras-libs)
- [Changelog](#changelog)

## Introdução

**schemas-lib** é uma biblioteca Node.js inspirada no **Zod**, desenvolvida para validação de esquemas e tipagem estática em TypeScript. Assim como o Zod, porém ela é muito mais embarcada e focada em **query strings**, **forms** e salvar em **banco de dados**. **schemas-lib** não faz validação para campos como **Set** e coisas como `.optional()` aceita tanto `null` quanto `undefined`, mas vai normalizar para `null`

**schemas-lib** é focado nos casos de uso da [Simple Organization](https://github.com/Simple-Organization), mas também tenta ter uma api até que compatível com o zod, especialmente por conta de LLMs e geração de código automático

O código atual não está 100% otimizado e tem muita repetição de código e redundancia para garantir o funcionamento correto com menos abstrações, mesmo assim ele deve ser muito mais rápido do que o Zod em todos aspectos, `TypeScript inference`, `parse`, e `runtime instanciation`

## Diferenças com outras libs

- [Schemas são mutáveis](#schemas-são-mutáveis)
- [Normalização para `null`](#normalização-para-null)
- [Todos campos de `number` e date já fazem `coerce`](#todos-campos-de-number-e-date-já-fazem-coerce)
- Campo `boolean()` é sempre [`stringbool()`](https://v4.zod.dev/v4#stringbool)
- Números nunca permitem valores infinitos ou `NaN`

### Schemas são mutáveis

Por que essa decisão?

Simplificação do código na base de códigos do **schemas-lib** e ganho de performance para `runtime instanciation`

### Normalização para null

Por que essa decisão?

Para evitar problemas de `undefined` e `null` em `query strings` e `forms`, o que é o foco do **schemas-lib**

Não tendo que diferenciar entre `null` e `undefined`, o código fica mais simples e fácil de entender, não há a necessidade de fazer `nullable()` e `nullish()`, e reduz drasticamente o número de `if` e `else` no código do **schemas-lib** e fica mais fácil de criar `schemas` customizados

### Todos campos de number já fazem coerce

Por que essa decisão?

Para simplificar o uso de `query strings` e `forms`, o que é o foco do **schemas-lib**, assim é necessário muito menos código para enviar um form do frontend para o backend, e o código fica mais simples e fácil de entender

```ts
const obj = object({ id: z.int() });
obj.parse({ id: '1' }); // { id: 1 }
```

### datetimeUTC

The `datetimeUTC` schema validates a utc date string or a object `Date`, and keep the date in string without the miliseconds

```ts
import { datetimeUTC } from 'schemas-lib';

datetimeUTC.parse('2023-07-20T21:19:25.711Z'); // pass and removes .711
datetimeUTC.parse('2020-1-1'); // fail
datetimeUTC.parse('2020-01-32'); // fail
```

### distinct and literal

A `literal` schema is a schema that only accepts a single value. It is useful with `distinct`

A `distinct` schema is a schema that differs two other `object` schemas, based with the `distinct` key

Is similar to [Discriminated unions](https://zod.dev/?id=discriminated-unions) from Zod

It is useful for things like `WebSocket` messages, where the server sends a message with a `type` field that determines the structure of the rest of the message

```ts
import { distinct, literal } from 'schemas-lib';

const object_with_name = object({
  type: literal(1),
  name: nameField,
});

const object_with_email = object({
  type: literal(2),
  email: email,
});

const _distinct = distinct('type', [obj1, obj2]);
```

## Versão 3.0.0

A versão 3 vai adotar algumas diferenças da 2, sendo que todos os `Schemas` serão criados com uma função

Exemplo:

```ts
import { string, int } from 'schemas-lib';

// Atualmente
const schema = string.min(1).max(10);

// Versão 3
const schema = string().min(1).max(10);
```

Essa mudança é para dar mais consistencia e melhorar o `Three shaking` da lib, pois no momento atual, o `Three shaking` não funciona muito bem por modificar o `prototype` dos `Schemas`

## Changelog

View the changelog at [CHANGELOG.md](CHANGELOG.md)
