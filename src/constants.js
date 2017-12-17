/**
 * @constant {RegExp} DOTTY_WITH_BRACKETS_SYNTAX_REGEXP
 */
export const DOTTY_WITH_BRACKETS_SYNTAX_REGEXP = /[a-zA-Z0-9_$]+|"[^"]+"|`[^`]+`|'[^']+'/g;

/**
 * @constant {RegExp} INVALID_JAVASCRIPT_CHARACTERS
 */
export const INVALID_JAVASCRIPT_CHARACTERS = /[^A-Za-z0-9_$]/;

/**
 * @constant {RegExp} INVALID_JAVASCRIPT_LEADING_CHARACTER
 */
export const INVALID_JAVASCRIPT_LEADING_CHARACTER = /[^A-Za-z_$]/;

/**
 * @constant {RegExp} QUOTES_REGEXP
 */
export const QUOTES_REGEXP = /['|"|`]/;

/**
 * @constant {RegExp} WHITE_SPACE
 */
export const WHITE_SPACE = /\s/g;
