/**
 * Testing class XKPassword
 */

import {Presets} from './presets.mjs';
import {XKPasswd} from './xkpasswd.mjs';

/*
 * Helper function to find duplicates
 */
const findDuplicates = (ar) =>
  ar.filter((item, index) => ar.indexOf(item) !== index);


describe('Test XKPassword class', () => {
  let me = {};

  beforeEach(() => {
    me = new XKPasswd();
  });

  describe('Test internal __separator function', () => {
    /*
     * The separator function is based on the Preset class
     * so we are going to use that knowledge to test.
     */

    const preset = Presets.getDefault();
    const alphabet = preset.config.symbol_alphabet;

    test('it returns a character', () => {
      const r = me.__separator();
      expect(typeof r).toBe('string');
      expect(r.length).toBe(1);
    });

    test('it returns a character in the alphabet list', () => {
      const r = me.__separator();

      expect(alphabet.toString().indexOf(r)).toBeGreaterThan(-1);
    });

    test('seperator NONE returns empty string', () => {
      const preset = {
        description: 'mock preset',
        config: {
          separator_character: 'NONE',
        },
      };
      me.setPreset(preset);
      const r = me.__separator();
      expect(r).toBe('');
    });

    test('unknown seperator returns empty string', () => {
      const preset = {
        description: 'mock preset',
        config: {
          separator_character: 'NOT_DEFINED',
        },
      };
      me.setPreset(preset);
      const r = me.__separator();
      expect(r).toBe('');
    });
  });

  describe('Test internal __paddingChar function', () => {
    /*
     * The paddingChar function is based on the Preset class
     * so we are going to use that knowledge to test.
     */

    const preset = Presets.getDefault();
    const alphabet = preset.config.symbol_alphabet;

    test('Check if it returns a character', () => {
      const r = me.__paddingChar('+');
      expect(typeof r).toBe('string');
      expect(r.length).toBe(1);
    });

    test('Check if it returns a character in the alphabet list', () => {
      const r = me.__paddingChar('');
      expect(alphabet.toString().indexOf(r)).toBeGreaterThan(-1);
    });

    test('when parameter is undefined it defaults to empty string', () => {
      const preset = {
        description: 'mock preset',
        config: {
          padding_character: 'SEPARATOR',
        },
      };
      me.setPreset(preset);
      const r = me.__paddingChar(undefined);
      expect(r).toBe('');
    });

    test('padding char NONE returns empty string', () => {
      const preset = {
        description: 'mock preset',
        config: {
          padding_character: 'NONE',
        },
      };
      me.setPreset(preset);
      const r = me.__paddingChar('-');
      expect(r).toBe('');
    });

    test('padding char SEPARATOR returns separator', () => {
      const preset = {
        description: 'mock preset',
        config: {
          padding_character: 'SEPARATOR',
        },
      };
      me.setPreset(preset);
      const r = me.__paddingChar('-');
      expect(r).toBe('-');
    });

    test('unknown padding char returns empty string', () => {
      const preset = {
        description: 'mock preset',
        config: {
          padding_character: 'NOT_DEFINED',
        },
      };
      me.setPreset(preset);
      const r = me.__paddingChar('-');
      expect(r).toBe('');
    });
  });

  describe('Test internal __adaptivePadding function', () => {
    test('it add padding when maxLen is bigger', () => {
      const passwd = 'abcdef';
      const pw = me.__adaptivePadding(passwd, '+', 10);

      expect(pw.length).toBe(10);
      expect(pw).toBe(passwd + '++++');
    });

    test('it to truncate when maxLen is smaller', () => {
      const passwd = 'abcdefghijklmnop';
      const pw = me.__adaptivePadding(passwd, '+', 5);

      expect(pw.length).toBe(5);
      expect(pw).toBe('abcde'); ;
    });
  });

  describe('Test internal function __transformCase', () => {
    const words = ['apple', 'mac', 'ipad'];

    test('it throws an error when parameter is wrong', () => {
      expect(() => me.__transformCase(123)).toThrow(Error);
      expect(() => me.__transformCase()).toThrow(Error);
    });

    test('transformation NONE does nothing', () => {
      const preset = {
        description: 'mock preset',
        config: {
          case_transform: 'NONE',
        },
      };
      me.setPreset(preset);
      const trans = me.__transformCase(words);
      expect(trans).toEqual(words);
    });

    test('transformation UPPER changes to uppercase', () => {
      const preset = {
        description: 'mock preset',
        config: {
          case_transform: 'UPPER',
        },
      };
      me.setPreset(preset);
      const trans = me.__transformCase(words);
      expect(trans).toEqual(['APPLE', 'MAC', 'IPAD']);
    });

    test('transformation LOWER changes to lowercase', () => {
      const preset = {
        description: 'mock preset',
        config: {
          case_transform: 'LOWER',
        },
      };
      me.setPreset(preset);
      const trans = me.__transformCase(words);
      expect(trans).toEqual(['apple', 'mac', 'ipad']);
    });

    test('transformation CAPITALISE changes to title case', () => {
      const preset = {
        description: 'mock preset',
        config: {
          case_transform: 'CAPITALISE',
        },
      };
      me.setPreset(preset);
      const trans = me.__transformCase(words);
      expect(trans).toEqual(['Apple', 'Mac', 'Ipad']);
    });

    test('transformation INVERT changes to inverted title case', () => {
      const preset = {
        description: 'mock preset',
        config: {
          case_transform: 'INVERT',
        },
      };
      me.setPreset(preset);
      const trans = me.__transformCase(words);
      expect(trans).toEqual(['aPPLE', 'mAC', 'iPAD']);
    });

    test('transformation ALTERNATE changes to alternate case', () => {
      const preset = {
        description: 'mock preset',
        config: {
          case_transform: 'ALTERNATE',
        },
      };
      me.setPreset(preset);
      const trans = me.__transformCase(words);
      expect(trans).toEqual(['apple', 'MAC', 'ipad']);
    });

    test('transformation RANDOM changes to alternate case', () => {
      const preset = {
        description: 'mock preset',
        config: {
          case_transform: 'RANDOM',
        },
      };
      me.setPreset(preset);
      const trans = me.__transformCase(words);
      expect(trans).toBeDefined();
      expect(trans.length).toBe(words.length);
      for (let i = 0; i < words.length; i++) {
        expect(trans[i].toLowerCase()).toBe(words[i].toLowerCase());
      }
    });

    test('unknown transformation does nothing', () => {
      const preset = {
        description: 'mock preset',
        config: {
          case_transform: 'UNKNOWN',
        },
      };
      me.setPreset(preset);
      const trans = me.__transformCase(words);
      expect(trans).toEqual(words);
    });
  });

  describe('Test password function', () => {
    test('Check if the password function returns a string', () => {
      expect(typeof me.password()).toEqual(expect.any(String));
    });

    test('Check if the password function returns a random password', () => {
    /*
     * We check this by getting a password 10 times and check if they are
     * different or the same.
     * Success is when they are all different.
     */
      const pwds = [];

      for (let index = 0; index < 10; index++) {
        pwds.push(me.password());
      }

      const duplicates = findDuplicates(pwds);
      // console.log('DEBUG ' + pwds);
      expect(duplicates.length).toBe(0);
    });
  });
});
