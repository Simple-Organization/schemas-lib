## Changelog

### [2.0.0] - 2024-08-14

Change

- **Break change** `object()` previously acts like zod [`.passthrough`](https://zod.dev/?id=passthrough), now it will act like [`.object`](https://zod.dev/?id=objects)

Fixed

- `.catch` not working in `object()` because of `.safeParse()`
- TypeScript type: `schema.default` and `schema.catch` now can be called without argument for `NumberSchema`, `ArraySchema`, `DatetimeSchema`, `ObjectSchema` and `StringSchema`

Removed

- **Break change** Removed support to argument in `schema.default`. No one uses it, and supporting it causes many bugs
- Now `ObjectSchema` will not override the `.optional()`, `.required()`, `nullable()` and `.nullish()` methods to remove the TS error

### [1.1.2] - 2024-08-14

Fixed

- Bug on `.catch` not being `nullish`
- Schema.jsType is now `unknown`
- Fixed CustomIssue

### [1.1.1] - 2024-08-14

Fixed

- Export `distinct` and `literal`
- TypeScript type: `schema.default` and `schema.catch` now can be called without argument

### [1.1.0] - 2024-08-12

Added

- `changeRequiredToOptional` method used for `UPDATE` queries, convert all `required` to `optional` and all `nullable` to `nullish`

Fixed

- `object.clone` will now clone the shape too

### [1.0.0] - 2024-08-08

Added

- `schema.catch()`

Removed

- `deepEq` and `fast-deep-equal` dependency (May cause break changes)
- `id_increments`

### [0.1.7] - 2024-08-02

Added

- `schema.errors()`

Changed

- Because of removal of `__DEV__`, jsType is always included on the meta

Removed

- Removed support do `__DEV__` and `__SERVER__` variables, to make more easy to use **schemas-lib** in an existing project
