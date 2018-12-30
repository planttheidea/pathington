// constants
import {
  CACHE,
  DOTTY_WITH_BRACKETS_SYNTAX,
  MAX_CACHE_SIZE,
  NUMBER,
  QUOTED_KEY,
  VALID_KEY,
  WHITE_SPACE,
} from './constants';

/**
 * @function isNumericKey
 *
 * @description
 * is the key passed a numeric string
 *
 * @param {string} key the key to test
 * @returns {boolean} is the key passed a numeric string
 */
export const isNumericKey = (key) => !!key.length && NUMBER.test(key);

/**
 * @function isQuotedKey
 *
 * @description
 * is the key passed a quoted key
 *
 * @param {string} key the key to test
 * @returns {boolean} is the key a quoted key
 */
export const isQuotedKey = (key) => QUOTED_KEY.test(key);

/**
 * @function shouldBeInBrackets
 *
 * @description
 * should the key passed be encased in brackets when in the path string
 *
 * @param {*} key the key that is being added to the path string
 * @returns {boolean} should the key be in brackets
 */
export const shouldBeInBrackets = (key) => typeof key === 'number' || isNumericKey(key) || isQuotedKey(key);

/**
 * @function shouldBeInQuotes
 *
 * @description
 * should the key passed be encased in quotes when in the path string
 *
 * @param {*} key the key that is being added to the path string
 * @returns {boolean} should the key be in quotes
 */
export const shouldBeInQuotes = (key) => WHITE_SPACE.test(key) || !VALID_KEY.test(key);

/**
 * @function createGetNormalizedCreateKey
 *
 * @description
 * get the normalized path string based on the quote and key passed
 *
 * @param {string} [quote="] the quote string to use
 * @returns {function(string, *): string}
 */
export const createGetNormalizedCreateKey = (quote) => (existingString, key) => {
  const normalizedKey = shouldBeInQuotes(key) ? `${quote}${key}${quote}` : key;

  return shouldBeInBrackets(normalizedKey)
    ? `${existingString}[${normalizedKey}]`
    : `${existingString}.${normalizedKey}`;
};

/**
 * @function getNormalizedParseKey
 *
 * @description
 * get the key as a number if parseable, or as a quoted string if applicable
 *
 * @param {string} key the key to try to parse
 * @returns {number|string} the parsed key
 */
export const getNormalizedParseKey = (key) => {
  const cleanKey = isQuotedKey(key) ? key.substring(1, key.length - 1) : key;

  return isNumericKey(cleanKey) ? +cleanKey : cleanKey;
};

/**
 * @function parsePath
 *
 * @description
 * parse the path, memoizing the results
 *
 * @param {string} path the path to parse
 * @returns {Array<number|string>} the parsed path
 */
export const parseStringPath = (path) => {
  if (CACHE.results[path]) {
    return CACHE.results[path];
  }

  if (CACHE.size > MAX_CACHE_SIZE) {
    CACHE.clear();
  }

  CACHE.results[path] = path ? path.match(DOTTY_WITH_BRACKETS_SYNTAX).map(getNormalizedParseKey) : [path];
  CACHE.size++;

  return CACHE.results[path];
};
