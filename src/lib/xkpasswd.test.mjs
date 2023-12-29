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
  const me = new XKPasswd();

  describe('Test internal __separator function', () => {
    /*
     * The separator function is based on the Preset class
     * so we are going to use that knowledge to test.
     */

    const preset = Presets.getDefault();
    const alphabet = preset.config.symbol_alphabet;

    test('Check if it returns a character', () => {
      const r = me.__separator();
      expect(typeof r).toBe('string');
      expect(r.length).toBe(1);
    });

    test('Check if it returns a character in the alphabet list', () => {
      const r = me.__separator();

      expect(alphabet.toString().indexOf(r)).toBeGreaterThan(-1);
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
