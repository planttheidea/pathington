import type { Path, PathItem } from './internalTypes.js';
import { isNumericKey, isQuotedKey } from './validate.js';

const DOTTY_WITH_BRACKETS_SYNTAX = /"[^"]+"|`[^`]+`|'[^']+'|[^.[\]]+/g;
const SYMBOL_HIDDEN_CHARACTERS = '\u200b';
const SYMBOL_VALUE = /\[\u200b*Symbol\(([^)\]]+)\)\]/g;

const symbolToString = new Map<symbol, string>();
const stringToSymbol = new Map<string, symbol>();

export function getNormalizedPathItem(pathItem: PathItem) {
  if (typeof pathItem !== 'string') {
    return pathItem;
  }

  if (isQuotedKey(pathItem)) {
    pathItem = pathItem.slice(1, pathItem.length - 1);
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

    parsedPath.push(getSymbolValue(match));

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

let hiddenCharacterLength = 1;

export function getStringifedSymbolKey(pathItem: symbol): string {
  const existing = symbolToString.get(pathItem);

  if (existing) {
    return existing;
  }

  const hiddenCharacters = Array.from({ length: hiddenCharacterLength++ }, () => SYMBOL_HIDDEN_CHARACTERS).join('');
  const string = `${hiddenCharacters}${pathItem.toString()}`;

  symbolToString.set(pathItem, string);
  stringToSymbol.set(string, pathItem);

  return string;
}

function getSymbolValue(match: RegExpExecArray): symbol {
  const maybeKey = match[0].slice(1, -1);
  const value = match[1];
  const symbol = value != null ? stringToSymbol.get(maybeKey) : undefined;

  return symbol || Symbol(value);
}
