import type { CreatePath, ParsePath, Path, PathItem, Quote, ReadonlyPath } from './internalTypes.js';
import { getNormalizedPathItem } from './utils.js';
import { isNumericKey, isQuotedKey, isValidQuote } from './validate.js';

const DOTTY_WITH_BRACKETS_SYNTAX = /"[^"]+"|`[^`]+`|'[^']+'|[^.[\]]+/g;
const VALID_KEY = /^\d+$|^[a-zA-Z_$][\w$]+$/;
const WHITE_SPACE = /\s/;

export function create<const P extends Path | ReadonlyPath, Q extends Quote = '"'>(
  path: P,
  quote: Q = '"' as Q,
): CreatePath<[...P], Q, '.'> {
  if (!Array.isArray(path)) {
    throw new ReferenceError(`\`path\` must be an array; received ${typeof path}`);
  }

  if (!isValidQuote(quote)) {
    throw new SyntaxError(`quote ${quote as string} passed is invalid, must be ", \`, or '.`);
  }

  return path.reduce<string>((string, pathItem) => {
    if (typeof pathItem === 'number') {
      pathItem = pathItem.toString();
    }

    if (WHITE_SPACE.test(pathItem) || !VALID_KEY.test(pathItem)) {
      pathItem = `${quote}${pathItem}${quote}`;
    }

    if (isNumericKey(pathItem) || isQuotedKey(pathItem)) {
      pathItem = `[${pathItem}]`;
    }

    return string ? `${string}.${pathItem}` : pathItem;
  }, '') as CreatePath<P, Q, '.'>;
}

export function parse<const P extends Path | ReadonlyPath | PathItem>(
  path: P,
): string extends P ? Path : ParsePath<P, []> {
  if (typeof path === 'string') {
    const pathItems = path && path.match(DOTTY_WITH_BRACKETS_SYNTAX);

    return (pathItems ? pathItems.map(getNormalizedPathItem) : [pathItems]) as ParsePath<P, []>;
  }

  if (Array.isArray(path)) {
    return path.map(getNormalizedPathItem) as ParsePath<P, []>;
  }

  if (typeof path === 'number') {
    return [path] as ParsePath<P, []>;
  }

  throw new TypeError(`Expected path to be a string, number, or array of strings/numbers; received ${typeof path}`);
}
