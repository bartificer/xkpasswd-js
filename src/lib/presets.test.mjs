/**
 * Test class Presets
 */

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
      separator_character: 'RANDOM',
      case_transform: 'CAPITALISE',
      separator_alphabet: ['+', '-'],
      padding_digits_before: 2,
      padding_digits_after: 2,
      padding_type: 'FIXED',
      padding_character: 'SEPARATOR',
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
        'APPLEID', 'NTLM', 'SECURITYQ', 'XKCD'];

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
});
