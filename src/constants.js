/**
 * @constant {Object} CACHE
 *
 * @property {function} clear clear the cache results
 * @property {Object} results the map of path => array results
 * @property {number} size the size of the cache
 */
export const CACHE = {
  clear() {
    CACHE.results = {};
    CACHE.size = 0;
  },
  results: {},
  size: 0
};

/**
 * @constant {RegExp} DOTTY_WITH_BRACKETS_SYNTAX
 */
export const DOTTY_WITH_BRACKETS_SYNTAX = /"[^"]+"|`[^`]+`|'[^']+'|[^.[\]]+/g;

/**
 * @constant {RegExp} INVALID_CHARACTERS
 */
export const INVALID_CHARACTERS = /[^\w$]/;

/**
 * @constant {RegExp} INVALID_FIRST_CHARACTER
 */
export const INVALID_FIRST_CHARACTER = /[^A-Za-z_$]/;

/**
 * @constant {number} MAX_CACHE_SIZE
 */
export const MAX_CACHE_SIZE = 500;

/**
 * @constant {RegExp} NUMBER
 */
export const NUMBER = /^\d+$/i;

/**
 * @constant {RegExp} QUOTED_KEY
 */
export const QUOTED_KEY = /^"[^"]+"|`[^`]+`|'[^']+'$/;

/**
 * @constant {Array<string>} VALID_QUOTES
 */
export const VALID_QUOTES = /^["'`]{1}$/;

/**
 * @constant {RegExp} WHITE_SPACE
 */
export const WHITE_SPACE = /\s/;
