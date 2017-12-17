// constants
import {DOTTY_WITH_BRACKETS_SYNTAX_REGEXP, QUOTES_GLOBAL_REGEXP, QUOTES_REGEXP} from './constants';

// utils
import {createGetNormalizedCreateKey, getNormalizedParseKey} from './utils';

/**
 * @function create
 *
 * @description
 * create a new path string based on the path and quote passed
 *
 * @param {Array<number|string>} path the path to convert to a string
 * @param {string} [quote="] the quote string to use when quoting keys
 * @returns {string} the path string
 */
export const create = (path, quote = '"') => {
  if (!Array.isArray(path)) {
    throw new ReferenceError('path passed must be an array');
  }

  if (quote && (quote.length !== 1 || !QUOTES_REGEXP.test(quote))) {
    throw new SyntaxError('quote passed is invalid, must be ", `, or \'.');
  }

  const pathString = path.reduce(createGetNormalizedCreateKey(quote), '');

  return pathString[0] === '.' ? pathString.slice(1) : pathString;
};

/**
 * @function parse
 *
 * @description
 * the path parsed into a valid array of keys / indices
 *
 * @param {Array<number|string>|number|string} path the path to parse
 * @returns {Array<number|string>} the parsed path
 */
export const parse = (path) => {
  if (Array.isArray(path)) {
    return path.map(getNormalizedParseKey);
  }

  if (typeof path === 'string') {
    return path
      ? path
        .replace(QUOTES_GLOBAL_REGEXP, '"')
        .match(DOTTY_WITH_BRACKETS_SYNTAX_REGEXP)
        .map(getNormalizedParseKey)
      : [];
  }

  return [path];
};
