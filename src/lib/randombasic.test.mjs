/**
 * Testing class RandomBasic
 */
import {RandomBasic} from './randombasic.mjs';

describe('Test RandomBasic', () => {
  const me = new RandomBasic();

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

      const findDuplicates = (ar) =>
        ar.filter((item, index) => ar.indexOf(item) !== index);

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
});
