type SerializablePathItem = number | string;
type PathItem = SerializablePathItem | symbol;
type Path = PathItem[];
type ReadonlyPath = readonly PathItem[];
type ParseablePath = Path | ReadonlyPath | PathItem;
type NumericKey = `${number}`;
type Quote = '"' | "'" | '`';
type QuotedKey = `${Quote}${SerializablePathItem}${Quote}`;
type SymbolKey = '<<symbol>>';
type BracketedKey<Key extends SerializablePathItem> = `[${Key}]`;
type BracketedQuotedKey<Key extends SerializablePathItem, Q extends Quote> = BracketedKey<`${Q}${Key}${Q}`>;
type JoinedKey<
  Key extends SerializablePathItem,
  Q extends Quote,
  S extends string,
  Rest extends unknown[],
  D extends string,
> = '.' extends S ? CreateNarrowPath<Rest, Q, `${Key}`> : CreateNarrowPath<Rest, Q, `${S}${D}${Key}`>;
type JoinNarrowPath<
  Key extends SerializablePathItem,
  Q extends Quote,
  S extends string,
  Rest extends unknown[],
  D extends string = '',
> = JoinedKey<Key, Q, S, Rest, D>;
type CreateNarrowPath<P, Q extends Quote, S extends string> = P extends [infer Key, ...infer Rest]
  ? Key extends number
    ? JoinNarrowPath<BracketedKey<Key>, Q, S, Rest>
    : Key extends string
      ? Key extends `${number}${string}`
        ? JoinNarrowPath<BracketedQuotedKey<Key, Q>, Q, S, Rest>
        : Key extends `${string} ${string}`
          ? JoinNarrowPath<BracketedQuotedKey<Key, Q>, Q, S, Rest>
          : Key extends `${string}.${string}`
            ? JoinNarrowPath<BracketedQuotedKey<Key, Q>, Q, S, Rest>
            : JoinNarrowPath<Key, Q, S, Rest, '.'>
      : Key extends symbol
        ? JoinNarrowPath<BracketedKey<SymbolKey>, Q, S, Rest>
        : S
  : S;
type CreatePath<P, Q extends Quote> = string[] extends P
  ? string
  : number[] extends P
    ? string
    : P extends Readonly<[infer Item, ...infer Rest]>
      ? CreateNarrowPath<[Item, ...Rest], Q, '.'>
      : CreateNarrowPath<P, Q, '.'>;
type SplitDots<P extends string> = P extends `${infer S}.${infer E}` ? [...SplitDots<S>, ...SplitDots<E>] : [P];
type SplitString<P extends string, A extends Array<string | symbol>> = P extends `${infer S}[${infer C}].${infer R}`
  ? '' extends S
    ? [...A, ...SplitString<C, []>, ...SplitString<R, []>]
    : [...A, ...SplitDots<S>, ...SplitString<C, []>, ...SplitString<R, []>]
  : P extends `${infer S}[${infer R}]`
    ? '' extends S
      ? [...A, ...SplitString<R, []>]
      : [...A, ...SplitDots<S>, ...SplitString<R, []>]
    : P extends `${infer S}][${infer E}`
      ? SplitString<E, [...A, ...SplitString<S, []>]>
      : P extends `[${infer S}`
        ? SplitString<S, A>
        : P extends `${infer E}]`
          ? SplitString<E, A>
          : P extends `${infer N extends number}`
            ? [...A, N]
            : P extends `${Quote}${infer C}${Quote}`
              ? [...A, C]
              : SymbolKey extends P
                ? [...A, symbol]
                : [...A, ...SplitDots<P>];
type ParseNarrowPath<P, A extends unknown[]> = P extends [infer Item, ...infer Rest]
  ? Item extends PathItem
    ? ParseNarrowPath<Rest, [...A, Item]>
    : never
  : P extends Readonly<[infer Item, ...infer Rest]>
    ? ParseNarrowPath<[Item, ...Rest], A>
    : P extends number
      ? [...A, P]
      : P extends string
        ? SymbolKey extends P
          ? symbol
          : SplitString<P, []>
        : A;
type ParsePath<P> = string extends P
  ? [P]
  : number extends P
    ? [P]
    : string[] extends P
      ? P
      : number[] extends P
        ? P
        : Path extends P
          ? P
          : ParseNarrowPath<P, []>;

declare function create<const P extends Path | ReadonlyPath, Q extends Quote = '"'>(
  path: P,
  quote?: Q,
): CreatePath<P, Q>;
declare function parse<const P extends ParseablePath>(path: P): ParsePath<P>;

export { create, parse };
export type {
  CreateNarrowPath,
  CreatePath,
  NumericKey,
  ParsePath,
  ParseablePath,
  Path,
  PathItem,
  Quote,
  QuotedKey,
  ReadonlyPath,
  SerializablePathItem,
  SymbolKey,
};
