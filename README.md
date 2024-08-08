# schemas-lib

## Table of contents

Table of contents

- [Introdução](#introdução)
- [Características Principais](#características-principais)
- [Diferenças com outras libs](#diferenças-com-outras-libs)
- [Basic usage](#basic-usage)
- [Changelog](#changelog)

## Introdução

**schemas-lib** é uma biblioteca Node.js inspirada no **Zod**, desenvolvida para validação de esquemas e tipagem estática em TypeScript. Assim como o Zod, **schemas-lib** oferece uma interface intuitiva e expressiva para definir e validar estruturas de dados, proporcionando uma experiência de desenvolvimento robusta e confiável.

## Diferenças com outras libs

A primeira diferença é que **schemas-lib** foca em fazer parsing de **query strings** e **forms**, então alguns campos como **boolean** aceitam valores como `"on"` por padrão

Então um `object` ou `array` ao receber uma string, já considera que seja um json e faz parse

```ts
const obj = object({ id: int });
obj.parse('{ "id": 1 }'); // { id: 1 }
```

Uma das diferenças entre uma lib como a `zod` é que o **schemas-lib** possui o foco em **reusar** instancias como **trimmed**, salvando um pouco de performance de maneira geral (linter, build, production)

E o **schemas-lib** faz uso extenso do **trimmed**, assim quase todos os campos costumam receber **trim** por padrão

```ts
import { z } from 'zod';
import { trimmed, string } from 'schemas-lib';

const zodSchema = z.string().trim();
const schemaLib = trimmed; // trimmed é o mesmo que zod.string().trim()
```

Quando se faz qualquer operação com o `trimmed` ele é clonado como no zod para não alterar o schema original e manter a integridade do schema

O **schemas-lib** gera a tipagem do objeto em uma propriedade do **meta**, `meta.jsType`aonde possue um Type do TypeScript

## Basic usage

Creating a simple string schema

```ts
import { trimmed, string } from 'schemas-lib';

// creating a schema for strings
const mySchema = trimmed;

// parsing
trimmed.parse('tuna'); // => "tuna"
trimmed.parse(12); // => throws ZodError

// "safe" parsing (doesn't throw error if validation fails)
string.safeParse('tuna'); // => 'tuna'
string.safeParse(12); // => Issue object
```

Creating an object schema

```ts
import { object, trimmed, Infer } from 'schemas-lib';

const user_schema = object({
  username: trimmed,
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

## Changelog

View the changelog at [CHANGELOG.md](CHANGELOG.md)
