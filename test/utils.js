// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';
import { CACHE, MAX_CACHE_SIZE } from 'src/constants';

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

test('if getNormalizedParseKey will return the key as a number when it is a quoted number string', (t) => {
  const key = '"1"';

  const result = utils.getNormalizedParseKey(key);

  t.is(result, parseInt(key.slice(1, -1), 10));
});

test('if isNumericKey returns false when an empty string', (t) => {
  const key = '';

  t.false(utils.isNumericKey(key));
});

test('if isNumericKey returns false when a single character string', (t) => {
  const key = 'd';

  t.false(utils.isNumericKey(key));
});

test('if isNumericKey returns false when a multi-character string', (t) => {
  const key = 'da';

  t.false(utils.isNumericKey(key));
});

test('if isNumericKey returns true when a single digit string', (t) => {
  const key = '4';

  t.true(utils.isNumericKey(key));
});

test('if isNumericKey returns true when a multi-digit string', (t) => {
  const key = '12';

  t.true(utils.isNumericKey(key));
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
  const quote = '"';

  const getNormalizedCreateKey = utils.createGetNormalizedCreateKey(quote);

  const existingKey = 'existingKey';
  const key = 'key';

  const result = getNormalizedCreateKey(existingKey, key);

  t.is(result, `${existingKey}.${key}`);
});

test('if createGetNormalizedCreateKey will create a method that provides bracket notation', (t) => {
  const quote = '"';

  const getNormalizedCreateKey = utils.createGetNormalizedCreateKey(quote);

  const existingKey = 'existingKey';
  const key = 0;

  const result = getNormalizedCreateKey(existingKey, key);

  t.is(result, `${existingKey}[${key}]`);
});

test('if createGetNormalizedCreateKey will create a method that provides quoted keys', (t) => {
  const quote = '"';

  const getNormalizedCreateKey = utils.createGetNormalizedCreateKey(quote);

  const existingKey = 'existingKey';
  const key = 'quoted key';

  const result = getNormalizedCreateKey(existingKey, key);

  t.is(result, `${existingKey}["${key}"]`);
});

test('if parseStringPath will return the entry in cache if it exists', (t) => {
  const path = 'entry.exists';
  const cachedResult = ['entry', 'exists'];

  CACHE.results[path] = cachedResult;

  const result = utils.parseStringPath(path);

  t.is(result, cachedResult);
});

test('if parseStringPath will store the entry in cache if it does not exist', (t) => {
  const path = 'does.not.exist';

  const result = utils.parseStringPath(path);

  t.deepEqual(result, ['does', 'not', 'exist']);
  t.deepEqual(CACHE.results[path], ['does', 'not', 'exist']);
});

test('if parseStringPath will clear the cache if it is higher than the cache limit', (t) => {
  const path = 'cache.full';

  CACHE.size = MAX_CACHE_SIZE + 1;

  const spy = sinon.spy(CACHE, 'clear');

  const result = utils.parseStringPath(path);

  t.deepEqual(result, ['cache', 'full']);
  t.deepEqual(CACHE.results[path], ['cache', 'full']);

  t.true(spy.calledOnce);

  spy.restore();

  t.is(CACHE.size, 1);
});
