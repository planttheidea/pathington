import type { PathItem } from './internalTypes.js';
import { isNumericKey, isQuotedKey } from './validate.js';

export function getNormalizedPathItem(pathItem: PathItem) {
  if (typeof pathItem === 'string' && isQuotedKey(pathItem)) {
    pathItem = pathItem.slice(1, pathItem.length - 1);
  }

  return isNumericKey(pathItem) ? +pathItem : pathItem;
}
