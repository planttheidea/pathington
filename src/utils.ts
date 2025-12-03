import type { ParsePath, PathItem } from './internalTypes.js';
import { isNumericKey, isQuotedKey } from './validate.js';

const DOTTY_WITH_BRACKETS_SYNTAX = /"[^"]+"|`[^`]+`|'[^']+'|[^.[\]]+/g;

export function getNormalizedPathItem(pathItem: PathItem) {
  if (typeof pathItem === 'string' && isQuotedKey(pathItem)) {
    pathItem = pathItem.slice(1, pathItem.length - 1);
  }

  return isNumericKey(pathItem) ? +pathItem : pathItem;
}

export function getParsedStringPath<const S extends string>(path: string): ParsePath<S, []> {
  const pathItems = path && path.match(DOTTY_WITH_BRACKETS_SYNTAX);

  return (pathItems ? pathItems.map(getNormalizedPathItem) : [pathItems]) as ParsePath<S, []>;
}
