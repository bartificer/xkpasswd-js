/**
 * Test class Presets
 *
 * @jest-environment jest-environment-node
 */

import {expect, jest, test, describe} from '@jest/globals';
import {Presets} from './presets.mjs';

describe('Test class Presets', () => {
  const me = Presets;

  const mock = {
    description: 'Mock preset',
    config: {
      // eslint-disable-next-line max-len
      symbol_alphabet: ['.', ';'],
      word_length_min: 4,
      word_length_max: 8,
      num_words: 1,
      case_transform: 'CAPITALISE',
      separator_type: 'RANDOM',
      separator_alphabet: ['+', '-'],
      padding_digits_before: 2,
      padding_digits_after: 2,
      padding_type: 'FIXED',
      padding_character_type: 'SEPARATOR',
      padding_alphabet: ['?', '!'],
      padding_characters_before: 2,
      padding_characters_after: 2,
      random_increment: 'AUTO',
    },
  };

  describe('Test function getDefault()', () => {
    /*
     * Because it is a static function, I don't think I need to initialize
     */
    test('it results in an object', () => {
      expect(typeof me.getDefault()).toEqual('object');
    });
    test('its result has a property "num_words"', () => {
      const obj = me.getDefault();

      expect(typeof obj.config.num_words !== undefined).toBe(true);
      expect(obj.config.num_words).toBe(3);
    });
  });

  describe('Test function getCurrent', () => {
    const def = me.getDefault();

    test('when initialized without parameter gives default set', () => {
      const preset = (new Presets()).getCurrent();
      expect(preset).toEqual(def);
    });

    test('when initialized with my preset gives the preset I added', () => {
      const preset = new Presets(mock);

      expect(preset.getCurrent()).not.toEqual(def);
      expect(preset.getCurrent()).toEqual(mock);
      expect(preset.name()).toBe('CUSTOM');
    });
  });

  describe('Test constructor', () => {
    test('if the param is a string, it should return a predefined', () => {
      const preset = new Presets('web16');
      expect(preset.name()).toBe('WEB16');
      expect(preset.config().word_length_min).toBe(4);
    });
    test('if the param is an object, it should return CUSTOM', () => {
      const preset = new Presets(mock);
      expect(preset.name()).toBe('CUSTOM');
      expect(preset.config().case_transform).toBe('CAPITALISE');
    });
    test('if the param is undefined, it should return DEFAULT', () => {
      const preset = new Presets();
      expect(preset.name()).toBe('DEFAULT');
      expect(preset.config().case_transform).toBe('CAPITALISE');
    });
    test('if the param is an unknown string, it should return DEFAULT', () => {
      const preset = new Presets('FAKE');
      expect(preset.name()).toBe('DEFAULT');
      expect(preset.config().case_transform).toBe('CAPITALISE');
    });
    test('if the param is not a string, it should return DEFAULT', () => {
      const preset = new Presets(42);
      expect(preset.name()).toBe('DEFAULT');
      expect(preset.config().case_transform).toBe('CAPITALISE');
    });
  });

  describe('Test simple getters', () => {
    test('description return the description', () => {
      const description = me.getDefault().description;

      const newPreset = new Presets();
      expect(newPreset.description()).toEqual(description);
    });

    test('getPresets returns list of keys', () => {
      const expected = ['DEFAULT', 'WEB32', 'WEB16', 'WIFI',
        'APPLEID', 'NTLM', 'SECURITYQ', 'XKCD', 'TEMPORARY'];

      const newPreset = new Presets();
      expect(newPreset.getPresets()).toEqual(expected);
    });
  });

  describe('Test function getSeparatorAlphabet', () => {
    test('if separator_alphabet exists, it is chosen', () => {
      const preset = new Presets(mock);
      const alfa = preset.config().separator_alphabet;

      const def = new Presets();
      const alfaDef = def.config().symbol_alphabet;

      expect(preset.__getSeparatorAlphabet()).toEqual(alfa);
      expect(def.__getSeparatorAlphabet()).toEqual(alfaDef);
    });
  });

  describe('Test function getPaddingAlphabet', () => {
    test('if padding_alphabet exists, it is chosen', () => {
      const preset = new Presets(mock);
      const def = new Presets();
      const alfa = preset.config().padding_alphabet;
      const alfaDef = def.config().symbol_alphabet;

      expect(preset.__getPaddingAlphabet()).toEqual(alfa);
      expect(def.__getPaddingAlphabet()).toEqual(alfaDef);
    });
  });

  describe('Test function __getMinMaxWordLength', () => {
    const me = new Presets();

    test('it returns min and max in the righ order', () => {
      let [min, max] = me.__getMinMaxWordLength(4, 7);
      expect(min).toBe(4);
      expect(max).toBe(7);
      [min, max] = me.__getMinMaxWordLength(7, 5);
      expect(min).toBe(5);
      expect(max).toBe(7);
    });

    test('it returns a min of 3 or greater', () => {
      let [min, max] = me.__getMinMaxWordLength(0, 7);
      expect(min).toBe(3);
      expect(max).toBe(7);

      [min, max] = me.__getMinMaxWordLength(-3, 7);
      expect(min).toBe(3);
      expect(max).toBe(7);

      [min, max] = me.__getMinMaxWordLength(7, -3);
      expect(min).toBe(3);
      expect(max).toBe(7);
    });

    test('it returns a max of 3 or greater', () => {
      let [min, max] = me.__getMinMaxWordLength(3, -3);
      expect(min).toBe(3);
      expect(max).toBe(3);

      [min, max] = me.__getMinMaxWordLength(3, -1);
      expect(min).toBe(3);
      expect(max).toBe(3);

      [min, max] = me.__getMinMaxWordLength(2, -3);
      expect(min).toBe(3);
      expect(max).toBe(3);
    });
  });

  describe('Test function __getSeparatorConfig', () => {
    describe('Test with the old config', () => {
      test('it returns a default for missing params', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.separator_type = undefined;
        config.separator_character = undefined;
        config.separator_alphabet = undefined;

        const me = new Presets();
        const actual = me.__getSeparatorConfig(config);
        const expected = {
          separatorType: 'NONE',
          separatorCharacter: '',
          separatorAlphabet: def.config().symbol_alphabet,
        };
        expect(actual).toEqual(expected);
      });

      test('it returns a default for missing params', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.separator_type = undefined;
        config.separator_character = undefined;
        config.separator_alphabet = undefined;

        const me = new Presets();
        const actual = me.__getSeparatorConfig(config);
        const expected = {
          separatorType: 'NONE',
          separatorCharacter: '',
          separatorAlphabet: def.config().symbol_alphabet,
        };
        expect(actual).toEqual(expected);
      });

      // eslint-disable-next-line max-len
      test('it returns a type RANDOM when the character is set to RANDOM', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.separator_type = undefined;
        config.separator_character = 'RANDOM';
        config.separator_alphabet = undefined;

        const me = new Presets();
        const actual = me.__getSeparatorConfig(config);
        const expected = {
          separatorType: 'RANDOM',
          separatorCharacter: '',
          separatorAlphabet: def.config().symbol_alphabet,
        };
        expect(actual).toEqual(expected);
      });

      test('it returns a FIXED type if a separator character is set', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.separator_type = undefined;
        config.separator_character = 'x';
        config.separator_alphabet = undefined;

        const me = new Presets();
        const actual = me.__getSeparatorConfig(config);
        const expected = {
          separatorType: 'FIXED',
          separatorCharacter: 'x',
          separatorAlphabet: def.config().symbol_alphabet,
        };
        expect(actual).toEqual(expected);
      });

      test('it throws an error for an unknown code', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.separator_type = undefined;
        config.separator_character = 'ABC';
        config.separator_alphabet = undefined;

        const me = new Presets();
        expect(() => {
          me.__getSeparatorConfig(config);
        }).toThrow(Error);
      });
    });

    describe('Test with the new config', () => {
      test('it returns a default for missing params for type NONE', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.separator_type = 'NONE';
        config.separator_character = undefined;
        config.separator_alphabet = undefined;

        const me = new Presets();
        const actual = me.__getSeparatorConfig(config);
        const expected = {
          separatorType: 'NONE',
          separatorCharacter: '',
          separatorAlphabet: def.config().symbol_alphabet,
        };
        expect(actual).toEqual(expected);
      });

      test('it returns defaults for type RANDOM', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.separator_type = 'RANDOM';
        config.separator_character = 'x';
        config.separator_alphabet = undefined;

        const me = new Presets();
        const actual = me.__getSeparatorConfig(config);
        const expected = {
          separatorType: 'RANDOM',
          separatorCharacter: '',
          separatorAlphabet: def.config().symbol_alphabet,
        };
        expect(actual).toEqual(expected);
      });

      test('it returns defaults for type FIXED', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.separator_type = 'FIXED';
        config.separator_character = 'A';
        config.separator_alphabet = undefined;

        const me = new Presets();
        const actual = me.__getSeparatorConfig(config);
        const expected = {
          separatorType: 'FIXED',
          separatorCharacter: 'A',
          separatorAlphabet: def.config().symbol_alphabet,
        };
        expect(actual).toEqual(expected);
      });

      test('it throws an error for type FIXED and more than 1 char', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.separator_type = 'FIXED';
        config.separator_character = 'ABC';
        config.separator_alphabet = undefined;

        const me = new Presets();
        expect(() => {
          me.__getSeparatorConfig(config);
        }).toThrow(Error);
      });

      test('it throws an error for an unknown type', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.separator_type = 'FAKE';
        config.separator_character = 'C';
        config.separator_alphabet = undefined;

        const me = new Presets();
        expect(() => {
          me.__getSeparatorConfig(config);
        }).toThrow(Error);
      });
    });
  });

  describe('Test function __getPaddingCharacterConfig', () => {
    describe('Test with the old config', () => {
      test('it returns a default for missing params', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.padding_character_type = undefined;
        config.padding_character = undefined;
        config.padding_alphabet = undefined;

        const me = new Presets();
        const actual = me.__getPaddingCharacterConfig(config);
        const expected = {
          paddingCharType: 'NONE',
          paddingCharacter: '',
          paddingAlphabet: def.config().symbol_alphabet,
        };
        expect(actual).toEqual(expected);
      });

      test('it returns a type RANDOM if character is set to RANDOM', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.padding_character_type = undefined;
        config.padding_character = 'RANDOM';
        config.padding_alphabet = undefined;

        const me = new Presets();
        const actual = me.__getPaddingCharacterConfig(config);
        const expected = {
          paddingCharType: 'RANDOM',
          paddingCharacter: '',
          paddingAlphabet: def.config().symbol_alphabet,
        };
        expect(actual).toEqual(expected);
      });

      test('it returns a FIXED type if a Padding character is set', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.padding_character_type = undefined;
        config.padding_character = 'x';
        config.padding_alphabet = undefined;

        const me = new Presets();
        const actual = me.__getPaddingCharacterConfig(config);
        const expected = {
          paddingCharType: 'FIXED',
          paddingCharacter: 'x',
          paddingAlphabet: def.config().symbol_alphabet,
        };
        expect(actual).toEqual(expected);
      });

      // eslint-disable-next-line max-len
      test('it throws an error if a padding character is set to an unknown code', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.padding_character_type = undefined;
        config.padding_character = 'xy';
        config.padding_alphabet = undefined;

        const me = new Presets();
        expect(() => {
          me.__getPaddingCharacterConfig(config);
        }).toThrow(Error);
      });
    });
    describe('Test with the new config', () => {
    // eslint-disable-next-line max-len
      test('it returns a SEPARATOR character if type is set to SEPARATOR', () => {
        const def = new Presets();
        // make a clone to avoid side effects
        const config = {...def.config()};
        config.padding_character_type = 'SEPARATOR';
        config.padding_character = 'xy';
        config.padding_alphabet = undefined;

        const me = new Presets();
        const actual = me.__getPaddingCharacterConfig(config);
        const expected = {
          paddingCharType: 'SEPARATOR',
          paddingCharacter: me.config().separator_character,
          paddingAlphabet: def.config().symbol_alphabet,
        };
        expect(actual).toEqual(expected);
      });
    });
    test('it returns type when character is empty but type is set', () => {
      const def = new Presets();
      // make a clone to avoid side effects
      const config = {...def.config()};
      config.padding_character_type = 'RANDOM';
      config.padding_character = undefined;
      config.padding_alphabet = 'xy!';

      const me = new Presets();
      const actual = me.__getPaddingCharacterConfig(config);
      const expected = {
        paddingCharType: 'RANDOM',
        paddingCharacter: '',
        paddingAlphabet: 'xy!',
      };
      expect(actual).toEqual(expected);
    });

    // eslint-disable-next-line max-len
    test('it should throw an error if the character is empty when the type is FIXED', () => {
      const def = new Presets();
      // make a clone to avoid side effects
      const config = {...def.config()};
      config.padding_character_type = 'FIXED';
      config.padding_character = undefined;
      config.padding_alphabet = 'xy!';

      const me = new Presets();
      expect(() => {
        me.__getPaddingCharacterConfig(config);
      }).toThrow(Error);
    });

    test('it returns type FIXED and character when both are set', () => {
      const def = new Presets();
      // make a clone to avoid side effects
      const config = {...def.config()};
      config.padding_character_type = 'FIXED';
      config.padding_character = 'A';
      config.padding_alphabet = 'xy!';

      const me = new Presets();
      const actual = me.__getPaddingCharacterConfig(config);
      const expected = {
        paddingCharType: 'FIXED',
        paddingCharacter: 'A',
        paddingAlphabet: 'xy!',
      };
      expect(actual).toEqual(expected);
    });

    // eslint-disable-next-line max-len
    test('it should throw an error if the type is unknown', () => {
      const def = new Presets();
      // make a clone to avoid side effects
      const config = {...def.config()};
      config.padding_character_type = 'FAKE';
      config.padding_character = undefined;
      config.padding_alphabet = ['x', 'y', '!'];

      const me = new Presets();
      expect(() => {
        me.__getPaddingCharacterConfig(config);
      }).toThrow(Error);
    });
  });
});
