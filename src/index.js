// constants
import {VALID_QUOTES} from './constants';

// utils
import {createGetNormalizedCreateKey, getNormalizedParseKey, parseStringPath} from './utils';

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

  if (!VALID_QUOTES.test(quote)) {
    throw new SyntaxError(`quote ${quote} passed is invalid, must be ", \`, or '.`);
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
  if (typeof path === 'string') {
    return parseStringPath(path);
  }

  if (Array.isArray(path)) {
    return path.map(getNormalizedParseKey);
  }

  return [typeof path === 'number' ? path : `${path}`];
};
