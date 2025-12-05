import type { CreatePath, ParseablePath, ParsePath, Path, Quote, ReadonlyPath } from './internalTypes.js';
import { getNormalizedPathItem, getSplitSymbols, getStringifedSymbolKey } from './utils.js';
import { isNumericKey, isQuotedKey } from './validate.js';

export type * from './internalTypes.js';

const DOTTY_WITH_BRACKETS_SYNTAX = /"[^"]+"|`[^`]+`|'[^']+'|[^.[\]]+/g;
const VALID_KEY = /^\d+$|^[a-zA-Z_$][\w$]+$/;
const VALID_QUOTE = /^["'`]{1}$/;
const WHITE_SPACE = /\s/;

export function create<const P extends Path | ReadonlyPath, Q extends Quote = '"'>(
  path: P,
  quote: Q = '"' as Q,
): CreatePath<P, Q> {
  if (!Array.isArray(path)) {
    throw new ReferenceError(`\`path\` must be an array; received ${typeof path}`);
  }

  if (!VALID_QUOTE.test(quote)) {
    throw new SyntaxError(`quote ${quote as string} passed is invalid, must be ", \`, or '.`);
  }

  return path.reduce<string>((string, pathItem) => {
    let stringPathItem: string;
    let symbol = false;

    if (typeof pathItem === 'string') {
      stringPathItem =
        WHITE_SPACE.test(pathItem) || !VALID_KEY.test(pathItem) ? `${quote}${pathItem}${quote}` : pathItem;
    } else if (typeof pathItem === 'number') {
      stringPathItem = pathItem.toString();
    } else if (typeof pathItem === 'symbol') {
      symbol = true;
      stringPathItem = getStringifedSymbolKey(pathItem);
    } else {
      throw new TypeError(`Items for \`path\` should be one of: [string, number, symbol]; received ${typeof pathItem}`);
    }

    if (symbol || isNumericKey(stringPathItem) || isQuotedKey(stringPathItem)) {
      stringPathItem = `[${stringPathItem}]`;
    }

    return string ? `${string}.${stringPathItem}` : stringPathItem;
  }, '') as CreatePath<P, Q>;
}

export function parse<const P extends ParseablePath>(path: P): ParsePath<P> {
  if (typeof path === 'string') {
    const splitPath = getSplitSymbols(path);
    const completePath: Path = [];

    splitPath.forEach((split) => {
      if (typeof split === 'string') {
        const dottyBracketItems = split ? split.match(DOTTY_WITH_BRACKETS_SYNTAX) : null;

        if (dottyBracketItems) {
          dottyBracketItems.forEach((value) => {
            completePath.push(getNormalizedPathItem(value));
          });

          return;
        }
      }

      completePath.push(split);
    });

    return completePath as ParsePath<P>;
  }

  if (Array.isArray(path)) {
    return path.map(getNormalizedPathItem) as ParsePath<P>;
  }

  if (typeof path === 'number' || typeof path === 'symbol') {
    return [path] as ParsePath<P>;
  }

  throw new TypeError(`Expected path to be a string, number, or array of strings/numbers; received ${typeof path}`);
}
