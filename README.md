# schemas-lib

## Table of contents

Table of contents

- [Introdução](#introdução)
- [Características Principais](#características-principais)
- [Diferenças com outras libs](#diferenças-com-outras-libs)
- [Basic usage](#basic-usage)
- [Changelog](#changelog)

## Introdução

**schemas-lib** é uma biblioteca Node.js inspirada no **Zod**, desenvolvida para validação de esquemas e tipagem estática em TypeScript. Assim como o Zod, porém ela é muito mais embarcada e focada em **query strings**, **forms** e salvar em **banco de dados**. **schemas-lib** não faz validação para campos como **Set** e coisas como `.optional()` aceita tanto `null` quanto `undefined`, mas vai normalizar para `undefined`

**schemas-lib** é focado nos casos de uso da [Simple Organization](https://github.com/Simple-Organization)

## Diferenças com outras libs

- Normalização para `undefined`
- Todos campos de `number` já fazem `coerce`
- Campo `boolean()` é sempre [`stringbool()`](https://v4.zod.dev/v4#stringbool)


```ts
const obj = object({ id: z.int() });
obj.parse({ id: '1' }); // { id: 1 }
```

## Basic usage

Creating a simple string schema

```ts
import { trimmed, string } from 'schemas-lib';

// creating a schema for strings
const mySchema = trimmed();

// parsing
trimmed().parse('tuna'); // => "tuna"
trimmed().parse(12); // => throws ZodError

// "safe" parsing (doesn't throw error if validation fails)
string().safeParse('tuna'); // => 'tuna'
string().safeParse(12); // => Issue object
```

Creating an object schema

```ts
import { object, trimmed, Infer } from 'schemas-lib';

const user_schema = object({
  username: trimmed(),
});

user_schema.parse({ username: 'Ludwig   ' }); // { username: 'Ludwig' }

// extract the inferred type
type User = infer<typeof User>;
// { username: string }
```

## Primitives

```ts
import {
  array,
  boolean,
  datetimeUTC,
  enumType,
  float,
  int,
  mixin,
  number,
  object,
  partialUpdateObj,
  strict,
  string,
  trimmed,
} from 'schemas-lib';

// Most used types
trimmed;
boolean;
int;

// generic string and number
string;
number;
float;

// objects
object;
strict;
partialUpdateObj;

array;
enumType;
mixin;

datetimeUTC;

// prebuilt
id;
intString;
url;
nameField;
email;
date;
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
