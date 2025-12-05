import type { Path, PathItem } from './internalTypes.js';
import { isNumericKey, isQuotedKey } from './validate.js';

const DOTTY_WITH_BRACKETS_SYNTAX = /"[^"]+"|`[^`]+`|'[^']+'|[^.[\]]+/g;
const SYMBOL_HIDDEN_CHARACTERS = '\u200b';
const SYMBOL_VALUE = /\[\u200bSymbol\(([^)]+)\)\u200b\]/g;

export function getNormalizedPathItem(pathItem: PathItem) {
  if (typeof pathItem !== 'string') {
    return pathItem;
  }

  if (isQuotedKey(pathItem)) {
    pathItem = pathItem.slice(1, pathItem.length - 1);
  } else {
    const symbol = SYMBOL_VALUE.exec(pathItem);

    if (symbol) {
      return Symbol(symbol[1]);
    }
  }

  return isNumericKey(pathItem) ? +pathItem : pathItem;
}

function getSplitDottyBracketItems(path: string): Path {
  const dottyBracketItems = path ? path.match(DOTTY_WITH_BRACKETS_SYNTAX) : null;

  return dottyBracketItems ? dottyBracketItems.map(getNormalizedPathItem) : [path];
}

export function getParsedStringPath(path: string): Path {
  const matches = Array.from(path.matchAll(SYMBOL_VALUE));

  if (!matches.length) {
    return getSplitDottyBracketItems(path);
  }

  let nextStartIndex = 0;
  let parsedPath: Path = [];

  matches.forEach((match, index) => {
    const before = path.slice(nextStartIndex, match.index);

    if (before) {
      parsedPath = parsedPath.concat(getSplitDottyBracketItems(before));
    }

    nextStartIndex = match.index + match[0].length;

    parsedPath.push(Symbol(match[1]));

    let after = path.slice(nextStartIndex);

    if (after && index === matches.length - 1) {
      if (after.startsWith('.')) {
        after = after.slice(1);
      }

      parsedPath = parsedPath.concat(getSplitDottyBracketItems(after));
    }
  });

  return parsedPath;
}

export function getStringifedSymbolKey(pathItem: symbol): string {
  return `${SYMBOL_HIDDEN_CHARACTERS}${pathItem.toString()}${SYMBOL_HIDDEN_CHARACTERS}`;
}
