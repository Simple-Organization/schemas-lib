## Changelog

### [0.1.9] - 2024-08-08

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
