/**
 * Testing class DictionaryES
 */

import {DictionaryES} from './dictionaryES.mjs';

describe('Test DictionaryES class', () => {
  let dict;

  beforeEach(() => {
    dict = new DictionaryES();
  });

  describe('Instantiation', () => {
    test('it can be instantiated', () => {
      expect(dict).toBeDefined();
      expect(dict).toBeInstanceOf(DictionaryES);
    });
  });

  describe('Word list', () => {
    test('wordList returns an array', () => {
      const list = dict.wordList();
      expect(Array.isArray(list)).toBe(true);
    });

    test('wordList contains more than 100 words', () => {
      const list = dict.wordList();
      expect(list.length).toBeGreaterThan(100);
    });

    test('all words are strings', () => {
      const list = dict.wordList();
      list.forEach((word) => {
        expect(typeof word).toBe('string');
      });
    });

    test('all words have length >= 3', () => {
      const list = dict.wordList();
      list.forEach((word) => {
        expect(word.length).toBeGreaterThanOrEqual(3);
      });
    });

    test('no word contains accented characters', () => {
      const list = dict.wordList();
      const accentRegex = /[àáâãäåèéêëìíîïòóôõöùúûüçñ]/i;
      list.forEach((word) => {
        expect(accentRegex.test(word)).toBe(false);
      });
    });

    test('no word contains whitespace or underscores', () => {
      const list = dict.wordList();
      const separatorRegex = /[\s_]/;
      list.forEach((word) => {
        expect(separatorRegex.test(word)).toBe(false);
      });
    });

    test('word list contains no duplicates', () => {
      const list = dict.wordList();
      const unique = new Set(list);
      expect(unique.size).toBe(list.length);
    });
  });

  describe('Length and word length', () => {
    test('getLength returns the correct number of words', () => {
      const list = dict.wordList();
      expect(dict.getLength()).toBe(list.length);
    });

    test('getMinWordLength returns a positive number', () => {
      expect(dict.getMinWordLength()).toBeGreaterThan(0);
    });

    test('getMaxWordLength returns a number >= minWordLength', () => {
      expect(dict.getMaxWordLength())
        .toBeGreaterThanOrEqual(dict.getMinWordLength());
    });

    test('getMinWordLength matches the actual shortest word', () => {
      const list = dict.wordList();
      const minLen = Math.min(...list.map((w) => w.length));
      expect(dict.getMinWordLength()).toBe(minLen);
    });

    test('getMaxWordLength matches the actual longest word', () => {
      const list = dict.wordList();
      const maxLen = Math.max(...list.map((w) => w.length));
      expect(dict.getMaxWordLength()).toBe(maxLen);
    });
  });

  describe('word() method', () => {
    test('it returns the first word at index 0', () => {
      const list = dict.wordList();
      expect(dict.word(0)).toBe(list[0]);
    });

    test('it returns the last word at last index', () => {
      const list = dict.wordList();
      expect(dict.word(list.length - 1)).toBe(list[list.length - 1]);
    });

    test('it throws an error for undefined index', () => {
      expect(() => dict.word(undefined)).toThrow(Error);
    });

    test('it throws an error for negative index', () => {
      expect(() => dict.word(-1)).toThrow(Error);
    });

    test('it throws an error for non-number index', () => {
      expect(() => dict.word('abc')).toThrow(Error);
    });

    test('it throws an error for index beyond list length', () => {
      const list = dict.wordList();
      expect(() => dict.word(list.length + 1)).toThrow(Error);
    });
  });

  describe('filteredWordList()', () => {
    test('it returns words within the specified length range', () => {
      const filtered = dict.filteredWordList(4, 6);

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((word) => {
        expect(word.length).toBeGreaterThanOrEqual(4);
        expect(word.length).toBeLessThanOrEqual(6);
      });
    });

    test('it returns an empty array for impossible range', () => {
      const filtered = dict.filteredWordList(100, 200);
      expect(filtered).toHaveLength(0);
    });
  });
});
