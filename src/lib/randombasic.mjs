/**
 * Random number generator based on Crypt::RNG:Basic
 *
 * @module XKPasswd
 */

import * as randomString from 'randomstring';
import is from 'is_js';

/**
 * Generate random numbers
 * @class XKPasswd
 */
class RandomBasic {
  /**
   * Generate an array of numbers between 0 and 9
   * Array length = parameter `num`
   *
   * @param {Integer} num - number of random numbers to generate,
   *  defaults to 1 if not given
   * @return {Array}
   * @throws Exception when parameter is not a number
   */
  randomNumbers(num) {
    // default to 1
    if (is.null(num) || is.undefined(num)) {
      num = 1;
    }
    if (is.not.integer(num)) {
      const errMsg = 'Parameter "num" is not an integer! [' + num + ']';
      // console.error('ERROR', errMsg);
      throw new Error(errMsg);
    }
    const randomArray = randomString.generate({
      length: num,
      charset: ['numeric'],
    });

    return randomArray;
  }
}

export {RandomBasic};
