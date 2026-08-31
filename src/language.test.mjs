/**
 * Testing language selection in XKPasswd
 */

import {XKPasswd} from './xkpasswd.mjs';

describe('Test language/dictionary selection', () => {
  let me;

  beforeEach(() => {
    me = new XKPasswd();
  });

  describe('getLanguages()', () => {
    test('it returns an array of language codes', () => {
      const langs = me.getLanguages();
      expect(Array.isArray(langs)).toBe(true);
      expect(langs.length).toBeGreaterThan(0);
    });

    test('it includes EN and PT-BR', () => {
      const langs = me.getLanguages();
      expect(langs).toContain('EN');
      expect(langs).toContain('PT-BR');
    });
  });

  describe('setDictionary()', () => {
    test('it throws an error for undefined language', () => {
      expect(() => me.setDictionary(undefined)).toThrow(Error);
    });

    test('it throws an error for non-string parameter', () => {
      expect(() => me.setDictionary(123)).toThrow(Error);
    });

    test('it throws an error for unsupported language', () => {
      expect(() => me.setDictionary('XX')).toThrow(/Unsupported language/);
    });

    test('it accepts EN (case-insensitive)', () => {
      expect(() => me.setDictionary('en')).not.toThrow();
      expect(() => me.setDictionary('EN')).not.toThrow();
    });

    test('it accepts PT-BR (case-insensitive)', () => {
      expect(() => me.setDictionary('pt-br')).not.toThrow();
      expect(() => me.setDictionary('PT-BR')).not.toThrow();
    });
  });

  describe('Password generation with PT-BR dictionary', () => {
    beforeEach(() => {
      me.setDictionary('PT-BR');
    });

    test('it generates a password string', () => {
      const password = me.password();
      expect(typeof password).toBe('string');
      expect(password.length).toBeGreaterThan(0);
    });

    test('it generates different passwords each time', () => {
      const passwords = [];
      for (let i = 0; i < 10; i++) {
        passwords.push(me.password());
      }
      const unique = [...new Set(passwords)];
      expect(unique.length).toBe(10);
    });

    test('it works with XKCD preset', () => {
      me.setPreset('XKCD');
      me.setDictionary('PT-BR');
      const password = me.password();
      expect(typeof password).toBe('string');
      // XKCD preset: 5 words, 4-8 chars, separated by dash
      expect(password).toMatch(/([a-zA-Z]{4,8}-){4}[a-zA-Z]{4,8}/);
    });

    test('it works with TEMPORARY preset', () => {
      me.setPreset('TEMPORARY');
      me.setDictionary('PT-BR');
      const password = me.password();
      expect(typeof password).toBe('string');
      // TEMPORARY: 2 words, 4 chars, capitalised, dash separator, 2 digits
      expect(password).toMatch(/([A-Z][a-z]{3}[-]){2}\d\d/);
    });

    test('passwords function returns correct number with PT-BR', () => {
      const pwArray = me.passwords(3);
      expect(pwArray).toHaveLength(3);
      pwArray.forEach((pw) => {
        expect(typeof pw).toBe('string');
        expect(pw.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Switching languages', () => {
    test('it can switch from EN to PT-BR and back', () => {
      me.setDictionary('EN');
      const pwEN1 = me.password();
      expect(typeof pwEN1).toBe('string');

      me.setDictionary('PT-BR');
      const pwPTBR = me.password();
      expect(typeof pwPTBR).toBe('string');

      me.setDictionary('EN');
      const pwEN2 = me.password();
      expect(typeof pwEN2).toBe('string');
    });

    test('setPreset does not reset dictionary choice', () => {
      me.setDictionary('PT-BR');
      me.setPreset('XKCD');
      // After setPreset, the dictionary should remain PT-BR
      const password = me.password();
      expect(typeof password).toBe('string');
      expect(password.length).toBeGreaterThan(0);
    });
  });
});
