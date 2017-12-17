# pathington

Create or parse an object path based on dot or bracket syntax.

## Table of contents

* [Usage](#usage)
* [Methods](#methods)
  * [parse](#parse)
  * [create](#create)
* [Browser support](#browser-support)
* [Development](#development)

## Usage

```javascript
import {create, parse} from 'pathington';

const parsedPath = parse('some[0].deeply["nested path"]');

console.log(parsed); // ['some', 0, 'deeply', 'nested path']

const createdPath = create(['some', 0, 'deeply', 'nested path']);

console.log(createdPath); // 'some[0].deeply["nested path"]'
```

## Methods

#### parse

`parse(path: (Array<number|string>|string)): string`

Parse a path into an array of path values.

```javascript
console.log(parse('simple')); // ['simple']
console.log(parse('dot.notation')); // ['dot', 'notation']
console.log(parse('array[0]')); // ['array', 0]
console.log(parse('array[0].with["quoted keys"]')); // ['array', 0, 'with', 'quoted keys']
console.log(parse('special["%characters*"]')); // ['special', '%characters*']
```

* If a path string is provided, it will be parsed into an array
* If an array is provided, it will be mapped with the keys normalized

#### create

`create(path: Array<number|string>[, quote="]): string`

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

## Browser support

* Chrome (all versions)
* Firefox (all versions)
* Edge (all versions)
* Opera 15+
* IE 9+
* Safari 6+
* iOS 8+
* Android 4+

## Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:

* `build` => run webpack to build development `dist` file with NODE_ENV=development
* `build:minified` => run webpack to build production `dist` file with NODE_ENV=production
* `dev` => run webpack dev server to run example app / playground
* `dist` => runs `build` and `build-minified`
* `lint` => run ESLint against all files in the `src` folder
* `prepublish` => runs `compile-for-publish`
* `prepublish:compile` => run `lint`, `test:coverage`, `transpile:es`, `transpile:lib`, `dist`
* `test` => run AVA test functions with `NODE_ENV=test`
* `test:coverage` => run `test` but with `nyc` for coverage checker
* `test:watch` => run `test`, but with persistent watcher
* `transpile:lib` => run babel against all files in `src` to create files in `lib`
* `transpile:es` => run babel against all files in `src` to create files in `es`, preserving ES2015 modules (for
  [`pkg.module`](https://github.com/rollup/rollup/wiki/pkg.module))
