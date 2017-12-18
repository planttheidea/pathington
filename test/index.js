// test
import test from 'ava';

// src
import * as index from 'src/index';

test('if create will throw an error if the path is not an array', (t) => {
  const path = undefined;
  const quote = undefined;

  t.throws(() => {
    index.create(path, quote);
  }, ReferenceError);
});

test('if create will throw an error if the path is provided but not the correct length', (t) => {
  const path = [];
  const quote = 'foo';

  t.throws(() => {
    index.create(path, quote);
  }, SyntaxError);
});

test('if create will throw an error if the path is provided but not a quote', (t) => {
  const path = [];
  const quote = 'f';

  t.throws(() => {
    index.create(path, quote);
  }, SyntaxError);
});

test('if create will create a path string when it is dot-notated', (t) => {
  const path = ['foo', 'bar'];
  const quote = undefined;

  const result = index.create(path, quote);

  t.is(result, `${path.join('.')}`);
});

test('if create will create a path string when it is bracked-notated', (t) => {
  const path = [0];
  const quote = undefined;

  const result = index.create(path, quote);

  t.is(result, `[${path[0]}]`);
});

test('if parse will return the cloned path itself when it is an array', (t) => {
  const path = [0, 'foo'];

  const result = index.parse(path);

  t.not(result, path);
  t.deepEqual(result, path);
});

test('if parse will handle when the path is a number, it will be coalesced to an array of that number', (t) => {
  const path = 0;

  const result = index.parse(path);

  t.deepEqual(result, [path]);
});

test('if parse will handle when the path is a string, it will parse out the path based on dot and bracket notation', (t) => {
  const keys = ['foo', 0, 'bar', 'baz'];
  const path = keys
    .reduce((keyString, key) => {
      return `${keyString}${typeof key === 'number' ? `[${key}]` : `.${key}`}`;
    }, '')
    .substr(1);

  const result = index.parse(path);

  t.deepEqual(result, keys);
});

test('if parse will handle the path when it is a single string that should be quoted', (t) => {
  const path = 'some string to be quoted';

  const result = index.parse(path);

  t.deepEqual(result, [path]);
});

test('if parse will handle the path will handle the bracket notation being first', (t) => {
  const path = '[0].foo';

  const result = index.parse(path);

  t.deepEqual(result, [0, 'foo']);
});

test('if parse will handle the path will handle the bracket notation being last', (t) => {
  const path = 'foo[0]';

  const result = index.parse(path);

  t.deepEqual(result, ['foo', 0]);
});

test('if parse will handle when the path is not an array or string, it will return the item in an array', (t) => {
  const path = 123;

  const result = index.parse(path);

  t.deepEqual(result, [123]);
});

test('if parse will handle when the path has nested quoted strings, it will respect those strings as singular keys', (t) => {
  const simple = '["foo.bar"]';
  const simplePath = index.parse(simple);

  t.deepEqual(simplePath, ['foo.bar']);

  const complex = '["foo"][`bar.baz`][\'quz\']';
  const complexPath = index.parse(complex);

  t.deepEqual(complexPath, ['foo', 'bar.baz', 'quz']);

  const crazy = 'foo[\'bar.baz\'].blah[0]["super.blah"]';
  const crazyPath = index.parse(crazy);

  t.deepEqual(crazyPath, ['foo', 'bar.baz', 'blah', 0, 'super.blah']);
});

test('if parse will handle when the path is an empty string', (t) => {
  const path = '';

  const result = index.parse(path);

  t.deepEqual(result, [path]);
});

test('if parse will handle when the path is a number', (t) => {
  const path = 0;

  const result = index.parse(path);

  t.deepEqual(result, [path]);
});

test('if parse will handle when the path is not an array, string, or number', (t) => {
  const path = null;

  const result = index.parse(path);

  t.deepEqual(result, [`${path}`]);
});
