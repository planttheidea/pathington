import type { NumericKey, PathItem, Quote, QuotedKey } from './internalTypes.js';

const NUMBER = /^\d+$/i;
const QUOTED_KEY = /^"[^"]+"|`[^`]+`|'[^']+'$/;
const VALID_QUOTE = /^["'`]{1}$/;

export function isNumericKey(pathItem: PathItem): pathItem is NumericKey {
  return typeof pathItem === 'number' || NUMBER.test(pathItem);
}

export function isQuotedKey(pathItem: string): pathItem is QuotedKey {
  return QUOTED_KEY.test(pathItem);
}

export function isValidQuote(quote: string): quote is Quote {
  return VALID_QUOTE.test(quote);
}
