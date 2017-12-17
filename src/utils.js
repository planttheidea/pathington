// constants
import {
  QUOTES_REGEXP,
  INVALID_JAVASCRIPT_CHARACTERS,
  INVALID_JAVASCRIPT_LEADING_CHARACTER,
  WHITE_SPACE
} from './constants';

/**
 * @function isQuotedKey
 *
 * @description
 * is the key passed a quoted key
 *
 * @param {string} key the key to test
 * @returns {boolean} is the key a quoted key
 */
export const isQuotedKey = (key) => {
  return QUOTES_REGEXP.test(key[0]) && key[0] === key[key.length - 1];
};

/**
 * @function shouldBeInBrackets
 *
 * @description
 * should the key passed be encased in brackets when in the path string
 *
 * @param {*} key the key that is being added to the path string
 * @returns {boolean} should the key be in brackets
 */
export const shouldBeInBrackets = (key) => {
  return typeof key === 'number' || !isNaN(+key) || isQuotedKey(key);
};

/**
 * @function shouldBeInQuotes
 *
 * @description
 * should the key passed be encased in quotes when in the path string
 *
 * @param {*} key the key that is being added to the path string
 * @returns {boolean} should the key be in quotes
 */
export const shouldBeInQuotes = (key) => {
  return (
    INVALID_JAVASCRIPT_CHARACTERS.test(key) ||
    WHITE_SPACE.test(key) ||
    (key.length > 1 && INVALID_JAVASCRIPT_LEADING_CHARACTER.test(key[0]))
  );
};

/**
 * @function createGetNormalizedCreateKey
 *
 * @description
 * get the normalized path string based on the quote and key passed
 *
 * @param {string} [quote="] the quote string to use
 * @returns {function(string, *): string}
 */
export const createGetNormalizedCreateKey = (quote = '"') => {
  return (existingString, key) => {
    const normalizedKey = shouldBeInQuotes(key) ? `${quote}${key}${quote}` : key;

    return shouldBeInBrackets(normalizedKey)
      ? `${existingString}[${normalizedKey}]`
      : `${existingString}.${normalizedKey}`;
  };
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
  return isQuotedKey(key) ? key.slice(1, -1) : isNaN(+key) ? key : +key;
};
