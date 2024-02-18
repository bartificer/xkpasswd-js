/**
 * Test class Statistics
 */

import {Statistics} from './statistics.mjs';

describe('Test class Statistics', () => {
  const mock = {
    description: 'Mock preset - this is a copy of the DEFAULT preset',
    config: {
      // eslint-disable-next-line max-len
      symbol_alphabet: ['!', '@', '$', '%', '^', '&', '*', '-', '_', '+', '=', ':', '|', '~', '?', '/', '.', ';'],
      word_length_min: 4,
      word_length_max: 8,
      num_words: 3,
      separator_character: 'RANDOM',
      padding_digits_before: 2,
      padding_digits_after: 2,
      padding_type: 'FIXED',
      padding_character: 'RANDOM',
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
        separator_character: 'NONE',
        padding_digits_before: 2,
        padding_digits_after: 2,
        padding_character: 'SEPARATOR',
        case_transform: 'CAPITALISE',
      };

      const me = new Statistics(mockConfig);

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
        separator_character: 'RANDOM',
        padding_digits_before: 3,
        padding_digits_after: 3,
        padding_character: 'SEPARATOR',
        case_transform: 'CAPITALISE',
      };

      const me = new Statistics(mockConfig);

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
        separator_character: 'NONE',
        padding_digits_before: 3,
        padding_digits_after: 3,
        padding_character: 'SEPARATOR',
        case_transform: 'RANDOM',
      };

      const me = new Statistics(mockConfig);

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
        separator_character: 'NONE',
        padding_digits_before: 3,
        padding_digits_after: 3,
        padding_character: 'RANDOM',
        case_transform: 'CAPITALISE',
      };

      const me = new Statistics(mockConfig);

      const expectedNumber =
        mockConfig.num_words + 1 +
        mockConfig.padding_digits_before +
        mockConfig.padding_digits_after;

      expect(me.__randomNumbersRequired()).toBe(expectedNumber);
    });

    test('on mock (DEFAULT) preset', () => {
      const me = new Statistics(mock.config);

      const expectedNumber = 9;

      expect(me.__randomNumbersRequired()).toBe(expectedNumber);
    });
  });

  describe('Test function __calculateDictionaryStats', () => {
    test('TODO add something meaningful', () => {
      const mockConfig = {
        num_words: 1,
        separator_character: 'NONE',
        padding_digits_before: 3,
        padding_digits_after: 3,
        padding_character: 'RANDOM',
        case_transform: 'CAPITALISE',
      };

      const me = new Statistics(mockConfig);

      const result = me.__calculateDictionaryStats();
      expect(result).toBeDefined();
      expect(result).toEqual({
        source: '',
        numWordsTotal: 0,
        numWordsFiltered: 0,
        percentWordsAvailable: 0,
        filterMinLength: 0,
        filterMaxLength: 0,
        containsAccents: false,
      });
    });
  });

  describe('Test function configStats', () => {
    test('on mock (DEFAULT) set', () => {
      const me = new Statistics(mock.config);

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
        separator_character: 'RANDOM',
        padding_digits_before: 2,
        padding_digits_after: 2,
        padding_type: 'ADAPTIVE',
        pad_to_length: 25,
        padding_character: 'RANDOM',
        padding_characters_before: 2,
        padding_characters_after: 2,
        case_transform: 'ALTERNATE',
        random_increment: 'AUTO',
      };

      const me = new Statistics(mockConfig);

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
      const me = new Statistics(mock.config);

      /* eslint-disable max-len */

      expect(me.__calculateEntropyStats()).toEqual({
        // minPermutationsBlind: 10408797222153426578715765348940396820955136n,
        // maxPermutationsBlind: 33581556514373188787421088705325971513167489664257311885404143616n,
        // permutationsBlind: 591222134364399413463902591994678504204696392694759424n,
        // permutationsSeen: 1399680000n,
        entropyBlind: 179,
        minEntropyBlind: {
          value: 143,
          state: 'GOOD',
          equal: false,
        },
        maxEntropyBlind: {
          value: 215,
          state: 'GOOD',
        },
        entropySeen: {
          value: 31,
          state: 'POOR',
        },
      });
      /* eslint-enable max-len */
    });

    test('when min and max are equal', () => {
      // only use the relevant keys
      const mockConfig = {
        symbol_alphabet: ['!', '@'],
        word_length_min: 4,
        word_length_max: 4,
        num_words: 3,
        separator_character: 'RANDOM',
        padding_digits_before: 2,
        padding_digits_after: 2,
        padding_type: 'FIXED',
        padding_character: 'RANDOM',
        padding_characters_before: 2,
        padding_characters_after: 2,
        case_transform: 'ALTERNATE',
      };

      const me = new Statistics(mockConfig);

      const expected = {
        minEntropyBlind: {
          value: 143,
          state: 'GOOD',
          equal: true,
        },
        maxEntropyBlind: {
          value: 143,
          state: 'OK',
        },
        entropySeen: {
          value: 25,
          state: 'POOR',
        },
      };

      const result = me.__calculateEntropyStats();
      expect(result.minEntropyBlind).toEqual(expected.minEntropyBlind);
      expect(result.maxEntropyBlind).toEqual(expected.maxEntropyBlind);
      expect(result.entropySeen).toEqual(expected.entropySeen);
    });

    test('when equal and less than threshold should result in POOR', () => {
      // only use the relevant keys
      const mockConfig = {
        symbol_alphabet: ['!', '@'],
        word_length_min: 4,
        word_length_max: 4,
        num_words: 2,
        separator_character: '+',
        padding_digits_before: 0,
        padding_digits_after: 0,
        padding_type: 'NONE',
        padding_character: 'NONE',
        padding_characters_before: 0,
        padding_characters_after: 0,
        case_transform: 'UPPER',
      };

      const me = new Statistics(mockConfig);

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
          value: 3,
          state: 'POOR',
        },
      };

      const result = me.__calculateEntropyStats();
      expect(result.minEntropyBlind).toEqual(expected.minEntropyBlind);
      expect(result.maxEntropyBlind).toEqual(expected.maxEntropyBlind);
      expect(result.entropySeen).toEqual(expected.entropySeen);
    });

    test('when seen is above threshold should result in GOOD', () => {
      // only use the relevant keys
      const mockConfig = {
      // eslint-disable-next-line max-len
        symbol_alphabet: ['!', '@', '$', '%', '^', '&', '*', '-', '_', '+', '=', ':', '|', '~', '?', '/', '.', ';'],
        word_length_min: 4,
        word_length_max: 8,
        num_words: 4,
        separator_character: 'RANDOM',
        padding_digits_before: 20,
        padding_digits_after: 20,
        padding_type: 'FIXED',
        padding_character: 'RANDOM',
        padding_characters_before: 2,
        padding_characters_after: 2,
        case_transform: 'RANDOM',
      };

      const me = new Statistics(mockConfig);

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
          value: 154,
          state: 'GOOD',
        },
      };

      const result = me.__calculateEntropyStats();
      expect(result.entropySeen).toEqual(expected.entropySeen);
    });

    test('when max is below threshold should result in POOR', () => {
      // only use the relevant keys
      const mockConfig = {
        symbol_alphabet: ['-'],
        word_length_min: 4,
        word_length_max: 5,
        num_words: 3,
        separator_character: 'NONE',
        padding_digits_before: 0,
        padding_digits_after: 0,
        padding_type: 'FIXED',
        padding_character: 'SEPARATOR',
        padding_characters_before: 0,
        padding_characters_after: 0,
        case_transform: 'LOWER',
      };

      const me = new Statistics(mockConfig);


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
          value: 5,
          state: 'POOR',
        },
      };

      const result = me.__calculateEntropyStats();
      expect(result.maxEntropyBlind).toEqual(expected.maxEntropyBlind);
      expect(result.entropySeen).toEqual(expected.entropySeen);
    });
  });

  describe('Test internal function __passwordStrength', () => {
    const me = new Statistics(mock.config);

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
        entropyBlind: 179,
        minEntropyBlind: 20,
        maxEntropyBlind: 215,
        entropySeen: 20,
      };

      expect(me.__passwordStrength(stats)).toBe('POOR');
    });

    test('with good password strength', () => {
      // these are just the entropies
      const stats = {
        entropyBlind: 179,
        minEntropyBlind: 143,
        maxEntropyBlind: 215,
        entropySeen: 60,
      };

      expect(me.__passwordStrength(stats)).toBe('GOOD');
    });
  });


  describe('Test calculateStats', () => {
    test('on mock (DEFAULT) preset', () => {
      const me = new Statistics(mock.config);

      /* eslint-disable max-len */

      const expected = {
        dictionary: {
          source: '',
          numWordsTotal: 0,
          numWordsFiltered: 0,
          percentWordsAvailable: 0,
          filterMinLength: 0,
          filterMaxLength: 0,
          containsAccents: false,
        },
        entropy: {
          // minPermutationsBlind: 10408797222153426578715765348940396820955136n,
          // maxPermutationsBlind: 33581556514373188787421088705325971513167489664257311885404143616n,
          // permutationsBlind: 591222134364399413463902591994678504204696392694759424n,
          // permutationsSeen: 1399680000n,
          entropyBlind: 179,
          minEntropyBlind: {
            value: 143,
            state: 'GOOD',
            equal: false,
          },
          maxEntropyBlind: {
            value: 215,
            state: 'GOOD',
          },
          entropySeen: {
            value: 31,
            state: 'POOR',
          },
          blindThreshold: 78,
          seenThreshold: 52,
        },
        password: {
          minLength: 24,
          maxLength: 36,
          randomNumbersRequired: 9,
          passwordStrength: 'OK',
        },
      };
      /* eslint-enable max-len */

      expect(me.calculateStats()).toEqual(expected);
    });
  });
});
