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
      expect(r).toHaveLength(1);
    });

    test('it returns a character in the alphabet list', () => {
      const r = me.__separator();

      expect(alphabet.toString().includes(r)).toBe(true);
    });

    test('separator undefined returns empty string', () => {
      const preset = {
        description: 'mock preset',
        config: {
          separator_character: undefined,
        },
      };
      me.setPreset(preset);
      const r = me.__separator();
      expect(r).toBe('');
    });

        test('separator NONE returns empty string', () => {
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

    test('unknown separator throws an error', () => {
      const preset = {
        description: 'mock preset',
        config: {
          separator_character: 'NOT_DEFINED',
        },
      };
      expect(() => {
        me.setPreset(preset);
      }).toThrow('Unknown separator code (NOT_DEFINED) found');
    });

    test('character in separator returns character', () => {
      const preset = {
        description: 'mock preset',
        config: {
          separator_character: 'x',
        },
      };
      me.setPreset(preset);
      const r = me.__separator();
      expect(r).toBe('x');
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
      expect(r).toHaveLength(1);
    });

    test('Check if it returns a character in the alphabet list', () => {
      const r = me.__paddingChar('');
      expect(alphabet.toString().indexOf(r)).toBeGreaterThan(-1);
    });

    // eslint-disable-next-line max-len
    test('it returns a character from the DEFAULT.symbol_alphabet if alphabet is empty', () => {
      const preset = {
        description: 'mock preset',
        config: {
          padding_character_type: 'RANDOM',
          padding_alphabet: '',
        },
      };
      me.setPreset(preset);
      const r = me.__paddingChar('');
      expect(alphabet.toString().indexOf(r)).toBeGreaterThan(-1);
    });

    test('when parameter is undefined it defaults to empty string', () => {
      const preset = {
        description: 'mock preset',
        config: {
          padding_character_type: 'SEPARATOR',
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
          padding_character_type: 'NONE',
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

    test('unknown padding char code throws an error', () => {
      const preset = {
        description: 'mock preset',
        config: {
          padding_character: 'NOT_DEFINED',
        },
      };
      expect( () => {
        me.setPreset(preset);
      }).toThrow(Error);
    });

    test('character in padding char returns character', () => {
      const preset = {
        description: 'mock preset',
        config: {
          padding_character: 'q',
        },
      };
      me.setPreset(preset);
      const r = me.__paddingChar('-');
      expect(r).toBe('q');
    });
  });

  describe('Test internal __adaptivePadding function', () => {
    test('it uses a space if padChar is undefined', () => {
      const passwd = 'abcdef';
      const pw = me.__adaptivePadding(passwd, undefined, 10);

      expect(pw).toHaveLength(10);
      expect(pw).toBe(passwd + '    ');
    });

        test('it uses a space if padChar is empty', () => {
      const passwd = 'abcdef';
      const pw = me.__adaptivePadding(passwd, '', 10);

      expect(pw).toHaveLength(10);
      expect(pw).toBe(passwd + '    ');
    });

    test('it adds padding when maxLen is bigger', () => {
      const passwd = 'abcdef';
      const pw = me.__adaptivePadding(passwd, '+', 10);

      expect(pw).toHaveLength(10);
      expect(pw).toBe(passwd + '++++');
    });

    test('it truncates when maxLen is smaller', () => {
      const passwd = 'abcdefghijklmnop';
      const pw = me.__adaptivePadding(passwd, '+', 5);

      expect(pw).toHaveLength(5);
      expect(pw).toBe('abcde');
    });
  });

  describe('Test function toTitleCase', () => {
    test('string is lowercase returns Lowercase', () => {
      expect(me.toTitleCase('lowercase')).toBe('Lowercase');
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
      expect(trans).toHaveLength(words.length);
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
      expect(duplicates).toHaveLength(0);
    });

    test('it should return a truncated string of pad_to_length length', () => {
      const preset = Presets.getDefault();

      preset.description = 'mock preset'; // just to make things clear
      preset.config.padding_type = 'ADAPTIVE';
      preset.config.pad_to_length = 20;

      me.setPreset(preset);
      const password = me.password();
      expect(password).toHaveLength(20);
      const lastChar = password[password.length - 1];
      expect(lastChar).not.toBe(preset.config.padding_character);
    });

    test('it should return a padded string of pad_to_length length', () => {
      const preset = Presets.getDefault();

      preset.description = 'mock preset'; // just to make things clear
      preset.config.separator_alphabet = ['+'];
      preset.config.padding_type = 'ADAPTIVE';
      preset.config.pad_to_length = 50;
      preset.config.padding_character_type = 'SEPARATOR';

      me.setPreset(preset);
      const password = me.password();
      expect(password).toHaveLength(50);
      const lastChar = password[password.length - 1];
      const expectedChar = '+'; // me.__paddingChar(me.__separator())
      expect(lastChar).toBe(expectedChar);
    });
  });

  describe('Test passwords function', () => {
    test('it should return an array with 1 password when num = 1', () => {
      const pwArray = me.passwords(1);

      expect(pwArray).toHaveLength(1);
      expect(typeof pwArray[0]).toBe('string');
    });

    /* eslint-disable-next-line max-len */
    test('it should return an array with 2 different passwords when num = 2', () => {
      const pwArray = me.passwords(2);

      expect(pwArray).toHaveLength(2);
      expect(typeof pwArray[0]).toBe('string');
      expect(typeof pwArray[1]).toBe('string');
      expect(pwArray[0]).not.toBe(pwArray[1]);
    });

    /* eslint-disable-next-line max-len */
    test('it should return an array with 1 password when num = 0', () => {
      const pwArray = me.passwords(1);

      expect(pwArray).toHaveLength(1);
      expect(typeof pwArray[0]).toBe('string');
    });

    /* eslint-disable-next-line max-len */
    test('it should return an array with 1 password when num is undefined', () => {
      const pwArray = me.passwords();

      expect(pwArray).toHaveLength(1);
      expect(typeof pwArray[0]).toBe('string');
    });

    /* eslint-disable-next-line max-len */
    test('it should return an array with 1 password when num is not a number', () => {
      const pwArray = me.passwords('string');

      expect(pwArray).toHaveLength(1);
      expect(typeof pwArray[0]).toBe('string');
    });
  });

  describe('Test all presets', () => {
    // make sure all the presets are tested to avoid
    // that some of them suddenly produce 'null' as password
    test('Test XKCD preset', () => {
      me.setPreset('XKCD');
      const password = me.password();
      expect(password).toMatch(/([a-zA-Z]{4,8}-){4}[a-zA-Z]{4,8}/);
    });

    test('Test SECURITYQ preset', () => {
      me.setPreset('SECURITYQ');
      const password = me.password();
      expect(password).toMatch(/([a-zA-Z]{4,8}\s){5}[a-zA-Z]{4,8}[.!?]/);
    });

    test('Test NTLM preset', () => {
      me.setPreset('NTLM');
      const password = me.password();
      expect(password)
        .toMatch(/[a-zA-Z]{5}[-+=.*_|~,][a-zA-Z]{5}[!@$%^&*+=:|~?]/);
    });

    test('Test APPLEID preset', () => {
      me.setPreset('APPLEID');
      const password = me.password();

      // eslint-disable-next-line max-len
      const re = /[-:.!?@&]\d\d([-:.@}][a-zA-Z]{4,7}){3}[-:.@}]\d\d[-:.!?@&]/;

      expect(password).toMatch(re);
    });

    test('Test WIFI preset', () => {
      me.setPreset('WIFI');
      const password = me.password();

      // eslint-disable-next-line max-len
      const re = /\d{4}([-+=.*_|~,][a-zA-Z]{4,8}){6}[-+=.*_|~,]\d{4}[!@$%^&*+=:|~?]{2,26}/;

      expect(password).toMatch(re);
    });

    test('Test WEB16 preset', () => {
      me.setPreset('WEB16');
      const password = me.password();

      // eslint-disable-next-line max-len
      const re = /[a-zA-Z]{4}([!@$%^&*-_+=:|~?/.][a-zA-Z]{4}){2}[!@$%^&*-_+=:|~?/.]\d\d/;

      expect(password).toMatch(re);
    });

    test('Test WEB32 preset', () => {
      me.setPreset('WEB32');
      const password = me.password();

      // eslint-disable-next-line max-len
      const re = /[!@$%^&*+=:|~]\d\d([-+=.*_|~][a-zA-Z]{4,5}){4}[-+=.*_|~]\d\d[!@$%^&*+=:|~]/;

      expect(password).toMatch(re);
    });
  });

  describe('Test internal __padWithChar', () => {
    test('Check with 0 padding', () => {
      me.setPreset('XKCD'); // preset has no padding_char before or after
      expect(me.__padWithChar('abc', '-')).toBe('abc');
    });

    test('Check with padding characters before 0 and after 1', () => {
      me.setPreset('SECURITYQ'); // preset with matching config
      expect(me.__padWithChar('abc', '-')).toBe('abc-');
    });

    test('Check with padding characters before 1 and after 1', () => {
      me.setPreset('APPLEID'); // preset with matching config
      expect(me.__padWithChar('abc', '-')).toBe('-abc-');
    });

  });
});
