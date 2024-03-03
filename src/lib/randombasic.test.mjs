/**
 * Testing class RandomBasic
 */
import {RandomBasic} from './randombasic.mjs';

/* helper function to find duplicates */
const findDuplicates = (ar) =>
  ar.filter((item, index) => ar.indexOf(item) !== index);

describe('Test RandomBasic', () => {
  const me = new RandomBasic();

  describe('Check function randomDigits', () => {
    test('it returns string of integers of given length', () => {
      const value = me.randomDigits(5);
      expect(typeof value).toBe('string');
      expect(value.length).toBe(5);
      expect(value).toMatch(/\d\d\d\d\d/);
    });

    test('it returns an empty string if max is not given', () => {
      const value = me.randomDigits();
      expect(typeof value).toBe('string');
      expect(value).toBe('');
    });

    test('it throws an error if max is not a number', () => {
      expect(() => me.randomDigits('string')).toThrow(Error);
    });
  });

  describe('Check function toss', () => {
    test('if it gives random numbers', () => {
      /*
       * We check this by getting a number 10 times and check if they are
       * different or the same.
       * Success is when they are not always the same.
       */
      const nums = new Array(10).fill(-1).map(() => me.toss());

      expect(nums.length).toBe(10);
      expect(typeof nums[0]).toBe('number');
      expect(findDuplicates(nums).length).toBeLessThan(10);
    });
  });

  describe('Check internal function __randomFloat', () => {
    test('it returns a float', () => {
      const r = me.__randomFloat();
      // there is no 'Float' in javascript,
      // therefore this test returns true for all "float" values,
      // including for those values that happen to be "integer" values.
      // see: https://stackoverflow.com/a/71453052
      expect(typeof r == 'number' && !isNaN(r)).toBe(true);
    });
    test('it returns a number between 0 and 1', () => {
      const r = me.__randomFloat();
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(1);
    });
  });

  describe('Check internal function __randomInt', () => {
    test('it returns an integer between min and max', () => {
      const r = me.__randomInt(1, 5);

      expect(r).toBeGreaterThanOrEqual(1);
      expect(r).toBeLessThanOrEqual(5);
    });

    test('it returns an integer in range when min > max', () => {
      const r = me.__randomInt(10, 5);

      expect(r).toBeGreaterThanOrEqual(5);
      expect(r).toBeLessThanOrEqual(10);
    });
  });

  describe('Check function randomInt', () => {
    test('it returns an integer between 0 and max', () => {
      const value = me.randomInt(5);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(5);
    });

    test('it returns an integer between 0 and 1 if max is not given', () => {
      const value = me.randomInt();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    });

    test('it throws an error if max is not a number', () => {
      expect(() => me.randomInt('string')).toThrow(Error);
    });
  });

  describe('Check function randomNumbers', () => {
    test('it returns a number', () => {
      expect(typeof me.randomNumbers(1)).toEqual(expect.any(String));
    });

    test('it returns a list the length of the parameter given', () => {
      const r = me.randomNumbers(10);
      expect(r.length).toBe(10);
      expect(me.randomNumbers(2).length).toBe(2);
      expect(me.randomNumbers(100).length).toBe(100);
    });

    test('it returns a list of random numbers', () => {
      /*
       * We check this by getting a number 10 times and check if they are
       * different or the same.
       * Success is when they are all different.
       */
      const nums = [];
      nums.push(me.randomNumbers(10));

      const duplicates = findDuplicates(nums);
      // console.log('DEBUG ' + nums);
      expect(duplicates.length).toBe(0);
    });

    test('it defaults to 1 if num is null', () => {
      const ar = me.randomNumbers();
      expect(ar.length).toBe(1);
      expect(typeof ar[0]).toEqual('number');
    });

    test('it throws an exception if num is not a number', () => {
      expect(() => me.randomNumbers('string')).toThrow(Error);
      expect(() => me.randomNumbers(1.5)).toThrow('not an integer');
    });
  });

  describe('Check function randomChar', () => {
    test('it returns an empty string when undefined', () => {
      const actual = me.randomChar(undefined);
      expect(actual).toBe('');
    });
    test('it returns the same character when charset.length = 1', () => {
      const actual = me.randomChar('x');
      expect(actual).toBe('x');
    });
    // eslint-disable-next-line max-len
    test('it returns a character from the charset when charset.length > 1', () => {
      const charset = 'qwertyjngfdcsx';
      const actual = me.randomChar(charset);
      expect(actual.length).toBe(1);
      expect(charset.includes(actual)).toBe(true);
    });
  });
});
