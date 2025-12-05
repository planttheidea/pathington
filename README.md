# pathington

Create or parse an object path based on dot or bracket syntax.

## Table of contents

- [Usage](#usage)
- [Methods](#methods)
  - [create](#create)
  - [parse](#parse)
- [Browser support](#browser-support)
- [Development](#development)

## Usage

```javascript
import { create, parse } from 'pathington';

const parsedPath = parse('some[0].deeply["nested path"]');

console.log(parsed); // ['some', 0, 'deeply', 'nested path']

const createdPath = create(['some', 0, 'deeply', 'nested path']);

console.log(createdPath); // 'some[0].deeply["nested path"]'
```

## Methods

### create

`create(path: Array<number|string>, quote?: '"' | "'" | '```'): string`

Create a path string based on the path values passed.

```javascript
console.log(create(['simple'])); // 'simple'
console.log(create(['array', 0])); // 'array[0]'
console.log(create(['array', 0, 'with', 'quoted keys'])); // 'array[0].with["quoted keys"]'
console.log(create(['special', '%characters*'])); // 'special["%charactres*"]'
```

Optionally, you can pass in the quote string to use instead of `"`. Valid values are backtick or single-quote.

```javascript
console.log(create(['quoted keys'], "'")); // ['quoted keys']
```

#### Symbols

You can provide symbols, and a string path will be created from it:

```ts
const symbol = Symbol('foo');
console.log(create(['array', 0, 'with', symbol])); // 'array[0].with[Symbol()]'
```

This can be used in concert with [`parse`](#parse) to extract the values pack:

```ts
const symbol = Symbol('foo');
const path = create(['array', 0, 'with', symbol]);
const parsedPath = parse(path);
console.log(parsedPath.at(-1) === symbol); // true
```

Because symbol values cannot be statically analyzed for their value by TS in the same way that numbers or strings can, a
consistent visual representation is used for all symbols:

```ts
const symbol = Symbol('foo');
const path = create(['array', 0, 'with', symbol]);
console.log(path); // array[0].with[Symbol()]
```

### parse

`parse(path: (Array<number|string>|string)): string`

Parse a path into an array of path values.

```javascript
console.log(parse('simple')); // ['simple']
console.log(parse('dot.notation')); // ['dot', 'notation']
console.log(parse('array[0]')); // ['array', 0]
console.log(parse('array[0].with["quoted keys"]')); // ['array', 0, 'with', 'quoted keys']
console.log(parse('special["%characters*"]')); // ['special', '%characters*']
```

- If a path string is provided, it will be parsed into an array
- If an array is provided, it will be mapped with the keys normalized

#### Symbols

While symbols can be used with this library, `parse` will only recognize them in a string path when that path is created
by [`create`](#create). If you try to manually stringify a symbol, it will identiy that value as a string key when
parsing.
