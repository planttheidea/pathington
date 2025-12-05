import type { PathItem } from './internalTypes.js';
import { isNumericKey, isQuotedKey } from './validate.js';

const SYMBOL_HIDDEN_CHARACTERS = '\u200b';
const SYMBOL_VALUE = /\[\u200bSymbol\(([^)]+)\)\u200b\]/g;

export function getExtractedSymbolValue(pathItem: string): symbol | undefined {
  const symbol = SYMBOL_VALUE.exec(pathItem);

  return symbol ? Symbol(symbol[1]) : undefined;
}

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

export function getSplitSymbols(path: string): Array<string | symbol> {
  const matches = Array.from(path.matchAll(SYMBOL_VALUE));

  if (!matches.length) {
    return [path];
  }

  const splitPath: Array<string | symbol> = [];

  let nextStartIndex = 0;

  matches.forEach((match, index) => {
    const before = path.slice(nextStartIndex, match.index);

    if (before) {
      splitPath.push(before);
    }

    nextStartIndex = match.index + match[0].length;

    splitPath.push(Symbol(match[1]));

    let after = path.slice(nextStartIndex);

    if (after && index === matches.length - 1) {
      if (after.startsWith('.')) {
        after = after.slice(1);
      }

      splitPath.push(after);
    }
  });

  return splitPath;
}

export function getStringifedSymbolKey(pathItem: symbol): string {
  return `${SYMBOL_HIDDEN_CHARACTERS}${pathItem.toString()}${SYMBOL_HIDDEN_CHARACTERS}`;
}
