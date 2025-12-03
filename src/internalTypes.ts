export type PathItem = number | string;
export type Path = PathItem[];
export type ReadonlyPath = readonly PathItem[];

export type NumericKey = `${number}`;
export type Quote = '"' | "'" | '`';
export type QuotedKey = `${Quote}${PathItem}${Quote}`;

export type CreatePath<P, Q extends Quote, S extends number | string> = P extends [infer Key, ...infer Rest]
  ? Key extends number
    ? '.' extends S
      ? CreatePath<Rest, Q, `[${Key}]`>
      : CreatePath<Rest, Q, `${S}[${Key}]`>
    : Key extends string
      ? Key extends `${string}.${string}`
        ? '.' extends S
          ? CreatePath<Rest, Q, `[${Q}${Key}${Q}]`>
          : CreatePath<Rest, Q, `${S}[${Q}${Key}${Q}]`>
        : '.' extends S
          ? CreatePath<Rest, Q, Key>
          : CreatePath<Rest, Q, `${S}.${Key}`>
      : Key extends symbol
        ? '.' extends S
          ? CreatePath<Rest, Q, '<SYMBOL>'>
          : CreatePath<Rest, Q, `${S}.<SYMBOL>`>
        : S
  : S;

type SplitDots<P extends string> = P extends `${infer S}.${infer E}` ? [...SplitDots<S>, ...SplitDots<E>] : [P];

type SplitString<P extends string, A extends string[]> = P extends `${infer S}[${infer C}].${infer R}`
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
              : [...A, ...SplitDots<P>];

export type ParsePath<P, A extends unknown[]> = P extends [infer Item, ...infer Rest]
  ? Item extends PathItem
    ? ParsePath<Rest, [...A, Item]>
    : never
  : P extends Readonly<[infer Item, ...infer Rest]>
    ? ParsePath<[Item, ...Rest], A>
    : P extends number
      ? [...A, P]
      : P extends string
        ? SplitString<P, []>
        : A;
