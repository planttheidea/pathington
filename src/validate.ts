import type { NumericKey, QuotedKey, SerializablePathItem } from './internalTypes.js';

const NUMBER = /^\d+$/i;
const QUOTED_KEY = /^"[^"]+"|`[^`]+`|'[^']+'$/;

export function isNumericKey(pathItem: SerializablePathItem): pathItem is NumericKey {
  return typeof pathItem === 'number' || NUMBER.test(pathItem);
}

export function isQuotedKey(pathItem: string): pathItem is QuotedKey {
  return QUOTED_KEY.test(pathItem);
}
