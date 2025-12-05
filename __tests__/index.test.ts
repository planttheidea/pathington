import { describe, expect, test } from 'vitest';
import { create, parse } from '../src/index.js';

describe('create', () => {
  test('creates a path string when it is dot-notated', () => {
    const result = create(['foo', 'bar']);

    expect(result).toBe('foo.bar');
  });

  test('creates a path string when it is bracked-notated', () => {
    const path = [0] as const;
    const result = create(path);

    expect(result).toBe('[0]');
  });

  test('creates a path string when it is a symbol', () => {
    const path = Symbol('foo');
    const result = create([path]);

    expect(result).toMatch(/Symbol\(foo\)/);
  });

  test('creates a path when a string that should be quoted because of whitespace', () => {
    const path = 'some string to be quoted';
    const result = create([path]);

    expect(result).toBe('["some string to be quoted"]');
  });

  test('creates a path when a string that should be quoted because of invalid characers', () => {
    const path = '1string';
    const result = create([path]);

    expect(result).toBe(`["${path}"]`);
  });

  describe('error conditions', () => {
    test('throws an error if the path is not an array', () => {
      const path = undefined;

      expect(() =>
        // @ts-expect-error - Testing error condition
        create(path),
      ).toThrow(ReferenceError);
    });

    test('throws an error if the path is provided but not the correct length', () => {
      const path: any[] = [];
      const quote = 'foo';

      expect(() =>
        // @ts-expect-error - Testing error condition
        create(path, quote),
      ).toThrow(SyntaxError);
    });

    test('throws an error if the path is provided but not a quote', () => {
      const path: any[] = [];
      const quote = 'f';

      expect(() =>
        // @ts-expect-error - Testing error condition
        create(path, quote),
      ).toThrow(SyntaxError);
    });

    test('throws when the path contains an invalid item', () => {
      expect(() => {
        // @ts-expect-error - Testing error condition
        create([{}]);
      }).toThrow(TypeError);
    });

    test('reuses the string for symbols when previously created', () => {
      const symbol = Symbol('foo');
      const path1 = create([symbol]);
      const path2 = create(['foo', symbol, 'bar']);

      expect(path1).not.toBe(path2);

      const parsedPath1 = parse(path1);
      const parsedPath2 = parse(path2);

      expect(parsedPath1).toEqual([symbol]);
      expect(parsedPath2).toEqual(['foo', symbol, 'bar']);
    });
  });
});

describe('parse', () => {
  test('if parse will return the cloned path itself when it is an array', () => {
    const path = [0, 'foo'] as const;
    const result = parse(path);

    expect(result).not.toBe(path);
    expect(result).toEqual(path);
  });

  test('handles when the path is a number, it will be coalesced to an array of that number', () => {
    const path = 0;

    const result = parse(path);

    expect(result).toEqual([path]);
  });

  test('handles when the path is a symbol, it will be coalesced to an array of that symbol', () => {
    const path = Symbol('foo');

    const result = parse(path);

    expect(result).toEqual([path]);
  });

  test('handles when the path is a string created by `create`, it will parse out the path based on dot and bracket notation', () => {
    const path = create(['foo', 0, 'bar', 'baz']);
    const result = parse(path);

    expect(result).toEqual(['foo', 0, 'bar', 'baz']);
  });

  test('handles when the path is a manual string, it will parse out the path based on dot and bracket notation', () => {
    const keys = ['foo', 0, 'bar', 'baz'];
    const path = keys
      .reduce<string>((keyString, key) => {
        return `${keyString}${typeof key === 'number' ? `[${key.toString()}]` : `.${key}`}`;
      }, '')
      .slice(1);

    const result = parse(path);

    expect(result).toEqual(keys);
  });

  test('handles the path when it is a single string', () => {
    const path = 'some string to be quoted';
    const result = parse(path);

    expect(result).toEqual([path]);
  });

  test('handles when the path is widened as string', () => {
    const path = 'foo' as string;
    const result = parse(path);

    expect(result).toEqual(['foo']);
  });

  test('handles when the path is widened as number', () => {
    const path = 0 as number;
    const result = parse(path);

    expect(result).toEqual([0]);
  });

  test('handles when the path is widened as array', () => {
    const path = ['foo', 0, 'bar', 'baz'];
    const result = parse(path);

    expect(result).toEqual(['foo', 0, 'bar', 'baz']);
  });

  test('handles the path will handle the bracket notation being last', () => {
    const result = parse('foo[0]');

    expect(result).toEqual(['foo', 0]);
  });

  test('handles when the path is not an array or string, it will return the item in an array', () => {
    const result = parse(123);

    expect(result).toEqual([123]);
  });

  test('handles when the path has nested quoted strings, it will respect those strings as singular keys', () => {
    const simple = '["foo.bar"]';
    const simplePath = parse(simple);

    expect(simplePath).toEqual(['foo.bar']);

    const complex = '["foo"][`bar.baz`][\'quz\']';
    const complexPath = parse(complex);

    expect(complexPath).toEqual(['foo', 'bar.baz', 'quz']);

    const crazy = 'foo[\'bar.baz\'].blah[0]["super.blah"]';
    const crazyPath = parse(crazy);

    expect(crazyPath).toEqual(['foo', 'bar.baz', 'blah', 0, 'super.blah']);
  });

  test('handles when the path is an empty string', () => {
    const result = parse('');

    expect(result).toEqual(['']);
  });

  test('handles when the path is a number', () => {
    const result = parse(0);

    expect(result).toEqual([0]);
  });

  test('handles when the path is a symbol reference', () => {
    const symbol = Symbol('foo');
    const result = parse([symbol]);

    expect(result).toEqual([symbol]);
  });

  test('handles when the path is a symbol reference in a created string', () => {
    const symbol = Symbol('foo');
    const path = create([symbol]);
    const result = parse(path);

    expect(result).toEqual([symbol]);
  });

  test('handles when the string path contans a symbol reference', () => {
    const symbol = Symbol('foo');
    const path = create(['foo', symbol, 'bar']);
    const result = parse(path);

    expect(result).toEqual(['foo', symbol, 'bar']);
  });

  test('handles when the string path contains a bunch of a symbol references', () => {
    const fooSymbol = Symbol('foo');
    const barSymbol = Symbol('bar');
    const baseSymbol = Symbol('baz');

    const path = create([fooSymbol, 'foo', 'bar.baz', 'quz', 0, barSymbol, 'blah', baseSymbol]);
    const result = parse(path);

    expect(result).toEqual([fooSymbol, 'foo', 'bar.baz', 'quz', 0, barSymbol, 'blah', baseSymbol]);
  });

  describe('error conditions', () => {
    test('throws when the path is not an array, string, or number', () => {
      expect(() =>
        // @ts-expect-error - Testing error condition
        parse(null),
      ).toThrow(TypeError);
    });
  });
});
