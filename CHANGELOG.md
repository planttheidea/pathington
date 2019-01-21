# pathington CHANGELOG

## 1.1.7

- Use custom `map` implementation for performance

## 1.1.6

- Update dependencies to the latest (`babel@7`, `ava@1`, etc).

## 1.1.5

- Simplify valid key regex (reduce filesize)

## 1.1.4

- Improve regexp coverage for dotty syntax
- Simplify `isNumericKey` regexp

## 1.1.3

- Add caching of string keys (huge performance boost for common use-cases)

## 1.1.2

- Ensure quoted numeric keys (indices) will be parsed as numbers

## 1.1.1

- Improve performance of `isQuotedKey` test

## 1.1.0

- If a value is not a standard type, `parse` will coerce the value to string and use that as key (`null` => `'null'`)
- Empty strings are now supported as keys

## 1.0.2

- Fix issue where single multi-space string was being split into separate keys (should be single quoted key)

## 1.0.1

- Ensure `es` transpilation is usable by bundles by including the `module` definition in `package.json`

## 1.0.0

- Initial release
