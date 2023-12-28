import {RandomBasic} from './randombasic.mjs';

describe('Test RandomBasic', () => {
  const me = new RandomBasic();

  describe('Check function randomNumbers', () => {
    test('it returns a number', () => {
      expect(typeof me.randomNumbers(1)).toEqual(expect.any(String));
    });

    test('it returns a list the length of the parameter given', () => {
      expect(me.randomNumbers(10).length).toBe(10);
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
      expect(me.randomNumbers().length).toBe(1);
    });

    test('it throws an exception if num is not a number', () => {
      expect(() => me.randomNumbers('string')).toThrow(Error);
      expect(() => me.randomNumbers(1.5)).toThrow('not an integer');
    });
  });
});
