/**
 * Test class Statistics
 */
/* jest-testenvironment: jsdom */

import {Statistics} from './statistics.mjs';
import {DictionaryEN} from './dictionaryEN.mjs';

describe('Test class Statistics', () => {
  const mockDict = new DictionaryEN();
  const mock = {
    description: 'Mock preset - this is a copy of the DEFAULT preset',
    config: {
      // eslint-disable-next-line max-len
      symbol_alphabet: '!@$%^&*-_+=:|~?/.;',
      word_length_min: 4,
      word_length_max: 8,
      num_words: 3,
      separator_type: 'RANDOM',
      padding_digits_before: 2,
      padding_digits_after: 2,
      padding_type: 'FIXED',
      padding_character_type: 'RANDOM',
      padding_characters_before: 2,
      padding_characters_after: 2,
      case_transform: 'ALTERNATE',
      // random_function: RandomBasic,
      random_increment: 'AUTO',
    },
  };

  describe('Test function __randomNumbersRequired', () => {
    test('if nothing is random', () => {
      // only properties necessary for the function
      const mockConfig = {
        num_words: 1,
        separator_type: 'NONE',
        padding_digits_before: 2,
        padding_digits_after: 2,
        padding_character_type: 'SEPARATOR',
        case_transform: 'CAPITALISE',
      };

      const me = new Statistics(mockConfig, mockDict);

      const expectedNumber =
        mockConfig.num_words +
        mockConfig.padding_digits_before +
        mockConfig.padding_digits_after;

      expect(me.__randomNumbersRequired()).toBe(expectedNumber);
    });

    test('if separator is RANDOM', () => {
      // only properties necessary for the function

      const mockConfig = {
        num_words: 1,
        separator_type: 'RANDOM',
        padding_digits_before: 3,
        padding_digits_after: 3,
        padding_character_type: 'SEPARATOR',
        case_transform: 'CAPITALISE',
      };

      const me = new Statistics(mockConfig, mockDict);

      const expectedNumber =
        mockConfig.num_words + 1 +
        mockConfig.padding_digits_before +
        mockConfig.padding_digits_after;

      expect(me.__randomNumbersRequired()).toBe(expectedNumber);
    });

    test('if case_transform is RANDOM', () => {
      // only properties necessary for the function

      const mockConfig = {
        num_words: 1,
        separator_type: 'NONE',
        padding_digits_before: 3,
        padding_digits_after: 3,
        padding_character_type: 'SEPARATOR',
        case_transform: 'RANDOM',
      };

      const me = new Statistics(mockConfig, mockDict);

      const expectedNumber =
        mockConfig.num_words + mockConfig.num_words +
        mockConfig.padding_digits_before +
        mockConfig.padding_digits_after;

      expect(me.__randomNumbersRequired()).toBe(expectedNumber);
    });

    test('if padding character is RANDOM', () => {
      // only properties necessary for the function

      const mockConfig = {
        num_words: 1,
        separator_type: 'NONE',
        padding_digits_before: 3,
        padding_digits_after: 3,
        padding_character_type: 'RANDOM',
        case_transform: 'CAPITALISE',
      };

      const me = new Statistics(mockConfig, mockDict);

      const expectedNumber =
        mockConfig.num_words + 1 +
        mockConfig.padding_digits_before +
        mockConfig.padding_digits_after;

      expect(me.__randomNumbersRequired()).toBe(expectedNumber);
    });

    test('on mock (DEFAULT) preset', () => {
      const me = new Statistics(mock.config, mockDict);

      /*
       * separator: random
       * padding: random
       * num words: 3
       * digits: 2 + 2
       * total: 2 + 2 + 3 + 1 + 1 = 9
       */
      const expectedNumber = 9;

      expect(me.__randomNumbersRequired()).toBe(expectedNumber);
    });
  });

  describe('Test function __calculateDictionaryStats', () => {
    test('returns an empty list if min and max are undefined', () => {
      const mockConfig = {
        num_words: 1,
        separator_type: 'NONE',
        padding_digits_before: 3,
        padding_digits_after: 3,
        padding_character_type: 'RANDOM',
        case_transform: 'CAPITALISE',
      };

      const me = new Statistics(mockConfig, mockDict);

      const result = me.__calculateDictionaryStats();
      expect(result).toBeDefined();
      expect(result).toEqual({
        numWordsTotal: 1259,
        numWordsFiltered: 0,
        percentWordsAvailable: 0,
        filterMinLength: 0,
        filterMaxLength: 0,
        containsAccents: false,
        source: '',
      });
    });

    test('returns a list even if min and max are reversed', () => {
      const mockConfig = {
        num_words: 1,
        word_length_min: 8,
        word_length_max: 4,
        separator_type: 'NONE',
        padding_digits_before: 3,
        padding_digits_after: 3,
        padding_character_type: 'RANDOM',
        case_transform: 'CAPITALISE',
      };

      const me = new Statistics(mockConfig, mockDict);

      const result = me.__calculateDictionaryStats();
      expect(result).toBeDefined();
      expect(result).toEqual({
        numWordsTotal: 1259,
        numWordsFiltered: 1194,
        percentWordsAvailable: 95,
        filterMinLength: 4,
        filterMaxLength: 8,
        containsAccents: false,
        source: '',
      });
    });

    test('returns an empty list if min and max are longer than max word length', () => {
      const mockConfig = {
        num_words: 1,
        word_length_min: 20,
        word_length_max: 20,
        separator_type: 'NONE',
        padding_digits_before: 3,
        padding_digits_after: 3,
        padding_character_type: 'RANDOM',
        case_transform: 'CAPITALISE',
      };

      const me = new Statistics(mockConfig, mockDict);

      const result = me.__calculateDictionaryStats();
      expect(result).toBeDefined();
      expect(result).toEqual({
        numWordsTotal: 1259,
        numWordsFiltered: 0,
        percentWordsAvailable: 0,
        filterMinLength: 0,
        filterMaxLength: 0,
        containsAccents: false,
        source: '',
      });
    });

  });

  describe('Test function configStats', () => {
    test('on mock (DEFAULT) set', () => {
      const me = new Statistics(mock.config, mockDict);

      const expected = {
        // (num_words * word_length) + baseLength
        minLength: 12 + 12,
        maxLength: 24 + 12,
        randomNumbersRequired: 9,
      };

      expect(me.configStats()).toEqual(expected);
    });

    test('if padding type is ADAPTIVE', () => {
      const mockConfig = {
        word_length_min: 4,
        word_length_max: 8,
        num_words: 3,
        separator_type: 'RANDOM',
        padding_digits_before: 2,
        padding_digits_after: 2,
        padding_type: 'ADAPTIVE',
        pad_to_length: 25,
        padding_character_type: 'RANDOM',
        padding_characters_before: 2,
        padding_characters_after: 2,
        case_transform: 'ALTERNATE',
        random_increment: 'AUTO',
      };

      const me = new Statistics(mockConfig, mockDict, mockDict);

      const expected = {
        minLength: 25,
        maxLength: 25,
        randomNumbersRequired: 9,
      };

      expect(me.configStats()).toEqual(expected);
    });
  });

  describe('Test internal function __calculateEntropyStats', () => {
    test('on mock (DEFAULT) set', () => {
      const me = new Statistics(mock.config, mockDict);
      const dictStats = {
        numWordsTotal: 1259,
        numWordsFiltered: 1194,
        percentWordsAvailable: 95,
        filterMinLength: 4,
        filterMaxLength: 8,
        containsAccents: false,
        source: '',
      };

      /* eslint-disable max-len */

      expect(me.__calculateEntropyStats(dictStats)).toEqual({
        entropyBlind: 198,
        minEntropyBlind: {
          value: 158,
          state: 'GOOD',
          equal: false,
        },
        maxEntropyBlind: {
          value: 237,
          state: 'GOOD',
        },
        entropySeen: {
          value: 54,
          state: 'GOOD',
        },
      });
      /* eslint-enable max-len */
    });

    test('when min and max are equal', () => {
      // only use the relevant keys
      const mockConfig = {
        symbol_alphabet: '!@',
        word_length_min: 4,
        word_length_max: 4,
        num_words: 3,
        separator_type: 'RANDOM',
        padding_digits_before: 2,
        padding_digits_after: 2,
        padding_type: 'FIXED',
        padding_character_type: 'RANDOM',
        padding_characters_before: 2,
        padding_characters_after: 2,
        case_transform: 'ALTERNATE',
      };
      const dictStats = {
        numWordsTotal: 1259,
        numWordsFiltered: 1194,
        percentWordsAvailable: 95,
        filterMinLength: 4,
        filterMaxLength: 8,
        containsAccents: false,
        source: '',
      };


      const me = new Statistics(mockConfig, mockDict);

      const expected = {
        minEntropyBlind: {
          value: 158,
          state: 'GOOD',
          equal: true,
        },
        maxEntropyBlind: {
          value: 158,
          state: 'OK',
        },
        entropySeen: {
          value: 47,
          state: 'POOR',
        },
      };

      const result = me.__calculateEntropyStats(dictStats);
      expect(result.minEntropyBlind).toEqual(expected.minEntropyBlind);
      expect(result.maxEntropyBlind).toEqual(expected.maxEntropyBlind);
      expect(result.entropySeen).toEqual(expected.entropySeen);
    });

    test('when equal and less than threshold should result in POOR', () => {
      // only use the relevant keys
      const mockConfig = {
        symbol_alphabet: '!@',
        word_length_min: 4,
        word_length_max: 4,
        num_words: 2,
        separator_type: '+',
        padding_digits_before: 0,
        padding_digits_after: 0,
        padding_type: 'NONE',
        padding_character_type: 'NONE',
        padding_characters_before: 0,
        padding_characters_after: 0,
        case_transform: 'UPPER',
      };
      const dictStats = {
        numWordsTotal: 1259,
        numWordsFiltered: 1194,
        percentWordsAvailable: 95,
        filterMinLength: 4,
        filterMaxLength: 8,
        containsAccents: false,
        source: '',
      };


      const me = new Statistics(mockConfig, mockDict);

      const expected = {
        minEntropyBlind: {
          value: 38,
          state: 'POOR',
          equal: true,
        },
        maxEntropyBlind: {
          value: 38,
          state: 'OK',
        },
        entropySeen: {
          value: 21,
          state: 'POOR',
        },
      };

      const result = me.__calculateEntropyStats(dictStats);
      expect(result.minEntropyBlind).toEqual(expected.minEntropyBlind);
      expect(result.maxEntropyBlind).toEqual(expected.maxEntropyBlind);
      expect(result.entropySeen).toEqual(expected.entropySeen);
    });

    test('when seen is above threshold should result in GOOD', () => {
      // only use the relevant keys
      const mockConfig = {
        // eslint-disable-next-line max-len
        symbol_alphabet: '!@$%^&*-_+=:|~?/.;',
        word_length_min: 4,
        word_length_max: 8,
        num_words: 4,
        separator_type: 'RANDOM',
        padding_digits_before: 20,
        padding_digits_after: 20,
        padding_type: 'FIXED',
        padding_character_type: 'RANDOM',
        padding_characters_before: 2,
        padding_characters_after: 2,
        case_transform: 'RANDOM',
      };
      const dictStats = {
        numWordsTotal: 1259,
        numWordsFiltered: 1194,
        percentWordsAvailable: 95,
        filterMinLength: 4,
        filterMaxLength: 8,
        containsAccents: false,
        source: '',
      };


      const me = new Statistics(mockConfig, mockDict);

      const expected = {
        minEntropyBlind: {
          value: 20,
          state: 'POOR',
          equal: true,
        },
        maxEntropyBlind: {
          value: 20,
          state: 'OK',
        },
        entropySeen: {
          value: 187,
          state: 'GOOD',
        },
      };

      const result = me.__calculateEntropyStats(dictStats);
      expect(result.entropySeen).toEqual(expected.entropySeen);
    });

    test('when max is below threshold should result in POOR', () => {
      // only use the relevant keys
      const mockConfig = {
        symbol_alphabet: '-',
        word_length_min: 4,
        word_length_max: 5,
        num_words: 3,
        separator_type: 'NONE',
        padding_digits_before: 0,
        padding_digits_after: 0,
        padding_type: 'FIXED',
        padding_character_type: 'SEPARATOR',
        padding_characters_before: 0,
        padding_characters_after: 0,
        case_transform: 'LOWER',
      };
      const dictStats = {
        numWordsTotal: 1259,
        numWordsFiltered: 1194,
        percentWordsAvailable: 95,
        filterMinLength: 4,
        filterMaxLength: 8,
        containsAccents: false,
        source: '',
      };

      const me = new Statistics(mockConfig, mockDict);

      const expected = {
        minEntropyBlind: {
          value: 18,
          state: 'POOR',
          equal: false,
        },
        maxEntropyBlind: {
          value: 71,
          state: 'POOR',
        },
        entropySeen: {
          value: 31,
          state: 'POOR',
        },
      };

      const result = me.__calculateEntropyStats(dictStats);
      expect(result.maxEntropyBlind).toEqual(expected.maxEntropyBlind);
      expect(result.entropySeen).toEqual(expected.entropySeen);
    });
  });

  describe('Test internal function __passwordStrength', () => {
    const me = new Statistics(mock.config, mockDict);

    test('on DEFAULT preset', () => {
      // these are just the entropies
      const stats = {
        entropyBlind: 179,
        minEntropyBlind: 143,
        maxEntropyBlind: 215,
        entropySeen: 31,
      };

      /* eslint-enable max-len */

      expect(me.__passwordStrength(stats)).toBe('OK');
    });

    test('with poor password strength', () => {
      // these are just the entropies
      const stats = {
        entropyBlind: {value: 179},
        minEntropyBlind: {value: 20},
        maxEntropyBlind: {value: 215},
        entropySeen: {value: 20},
      };

      expect(me.__passwordStrength(stats)).toBe('POOR');
    });

    test('with good password strength', () => {
      // these are just the entropies
      const stats = {
        entropyBlind: {value: 179},
        minEntropyBlind: {value: 143},
        maxEntropyBlind: {value: 215},
        entropySeen: {value: 60},
      };

      expect(me.__passwordStrength(stats)).toBe('GOOD');
    });
  });

  describe('Test calculateStats', () => {
    test('on mock (DEFAULT) preset', () => {
      const me = new Statistics(mock.config, mockDict);

      /* eslint-disable max-len */

      const expected = {
        dictionary: {
          source: '',
          numWordsTotal: 1259,
          numWordsFiltered: 1194,
          percentWordsAvailable: 95,
          filterMinLength: 4,
          filterMaxLength: 8,
          containsAccents: false,
        },
        entropy: {
          entropyBlind: 198,
          minEntropyBlind: {
            value: 158,
            state: 'GOOD',
            equal: false,
          },
          maxEntropyBlind: {
            value: 237,
            state: 'GOOD',
          },
          entropySeen: {
            value: 54,
            state: 'GOOD',
          },
          blindThreshold: 78,
          seenThreshold: 52,
        },
        password: {
          minLength: 24,
          maxLength: 36,
          randomNumbersRequired: 9,
          passwordStrength: 'GOOD',
        },
      };
      /* eslint-enable max-len */

      expect(me.calculateStats()).toEqual(expected);
    });
  });
});
