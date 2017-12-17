// test
import test from 'ava';

// src
import * as utils from 'src/utils';

test('if getNormalizedParseKey will return the key as-is when it is not a number', (t) => {
  const key = 'foo';

  const result = utils.getNormalizedParseKey(key);

  t.is(result, key);
});

test('if getNormalizedParseKey will return the key as a number when it is a number string', (t) => {
  const key = '1';

  const result = utils.getNormalizedParseKey(key);

  t.is(result, parseInt(key, 10));
});

test('if isQuotedKey will return true when quoted', (t) => {
  const key = '"some.quoted.key"';

  t.true(utils.isQuotedKey(key));
});

test('if isQuotedKey will return false when not quoted', (t) => {
  const key = 'some.quoted.key';

  t.false(utils.isQuotedKey(key));
});

test('if shouldBeInBrackets will return true when a number', (t) => {
  const key = 0;

  t.true(utils.shouldBeInBrackets(key));
});

test('if shouldBeInBrackets will return true when a number as a string', (t) => {
  const key = '0';

  t.true(utils.shouldBeInBrackets(key));
});

test('if shouldBeInBrackets will return true when a quoted string', (t) => {
  const key = '"quoted key"';

  t.true(utils.shouldBeInBrackets(key));
});

test('if shouldBeInBrackets will return false when a normal string', (t) => {
  const key = 'key';

  t.false(utils.shouldBeInBrackets(key));
});

test('if shouldBeInQuotes will return true if an invalid JS character', (t) => {
  const key = '#foo';

  t.true(utils.shouldBeInQuotes(key));
});

test('if shouldBeInQuotes will return true if the first character is a number', (t) => {
  const key = '0foo';

  t.true(utils.shouldBeInQuotes(key));
});

test('if shouldBeInQuotes will return true if white space exists', (t) => {
  const key = 'some key';

  t.true(utils.shouldBeInQuotes(key));
});

test('if shouldBeInQuotes will return false if valid JS characters', (t) => {
  const key = '_$123_key';

  t.false(utils.shouldBeInQuotes(key));
});

test('if createGetNormalizedCreateKey will create a method that provides dot notation', (t) => {
  const quote = undefined;

  const getNormalizedCreateKey = utils.createGetNormalizedCreateKey(quote);

  const existingKey = 'existingKey';
  const key = 'key';

  const result = getNormalizedCreateKey(existingKey, key);

  t.is(result, `${existingKey}.${key}`);
});

test('if createGetNormalizedCreateKey will create a method that provides bracket notation', (t) => {
  const quote = undefined;

  const getNormalizedCreateKey = utils.createGetNormalizedCreateKey(quote);

  const existingKey = 'existingKey';
  const key = 0;

  const result = getNormalizedCreateKey(existingKey, key);

  t.is(result, `${existingKey}[${key}]`);
});

test('if createGetNormalizedCreateKey will create a method that provides quoted keys', (t) => {
  const quote = undefined;

  const getNormalizedCreateKey = utils.createGetNormalizedCreateKey(quote);

  const existingKey = 'existingKey';
  const key = 'quoted key';

  const result = getNormalizedCreateKey(existingKey, key);

  t.is(result, `${existingKey}["${key}"]`);
});

test('if createGetNormalizedCreateKey will create a method that provides quoted keys with a custom quote string', (t) => {
  const quote = '`';

  const getNormalizedCreateKey = utils.createGetNormalizedCreateKey(quote);

  const existingKey = 'existingKey';
  const key = 'quoted key';

  const result = getNormalizedCreateKey(existingKey, key);

  t.is(result, `${existingKey}[\`${key}\`]`);
});
