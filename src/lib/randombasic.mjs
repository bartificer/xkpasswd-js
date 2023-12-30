/**
 * Random number generator based on Crypt::RNG:Basic
 *
 * @module RandomBasic
 */

import cryptoRandomString from 'crypto-random-string';
import is from 'is-it-check';
import log from 'loglevel';

/**
 * Generate random numbers
 * @class XKPasswd
 */
class RandomBasic {
  /**
   * Generate a random character based on a given charset
   *
   * @param {string} charset - charset to choose from
   * @return {char} - random character
   */
  randomChar(charset) {
    const c = cryptoRandomString({
      length: 1,
      characters: charset.toString(),
    });
    return c;
  }

  /**
   * Generate a number of random digits
   *
   * @param {Integer} num - number of random digits to generate,
   *  defaults to empty string if not given
   * @return {Array} - array of random digits
   * @throws Exception when parameter is not a number
   *
   */
  randomDigits(num) {
    // default to 1
    if (is.null(num) || is.undefined(num) || num <= 0) {
      return '';
    }
    if (is.not.integer(num)) {
      const errMsg = 'Parameter "num" is not an integer! [' + num + ']';
      // log.error('ERROR', errMsg);
      throw new Error(errMsg);
    }

    // const digits = new Array(num).fill(0).map(() => this.randomInt(10));
    const digits = cryptoRandomString({
      length: num,
      type: 'numeric',
    });
    return digits;
  }

  /**
   * Toss: generate a random odd/even number
   *
   * @return {int} - a random value 0 or 1
   */
  toss() {
    const t = cryptoRandomString({
      length: 10,
      type: 'numeric',
    });
    return parseInt(t) % 2;
  }

  /**
   * Generate a random integer greater than 0 and less than a given
   * maximum value.
   *
   * @param {integer} max - max value of the random number (positive integer)
   * @return {integer} - the random number
   * @throws Exception when the parameter is not an integer
   */
  randomInt(max) {
    // default to 1
    if (is.null(max) || is.undefined(max)) {
      max = 1;
    }
    if (is.not.integer(max)) {
      const errMsg = 'Parameter "max" is not an integer! [' + max + ']';
      // log.error('ERROR', errMsg);
      throw new Error(errMsg);
    }
    return this.__randomInt(0, max);
  }


  /**
   * Return values in the range of [0, 1]
   *
   * @return {number} - a random number between 0 and 1
   *
   * @private
   */
  __randomFloat() {
    // const float = crypto.getRandomValues(new Uint32Array(1))[0];
    // return float / 2**32;

    const str = cryptoRandomString({
      length: 10,
      type: 'numeric',
    });
    const float = (parseInt(str) / 10**10);
    log.trace('__randomFloat ' + float);
    return float;
  }

  /**
   * Return integers in the range of [min, max]
   * If min > max then swap min and max
   *
   * @param {int} min - minimum value
   * @param {int} max - maximum value
   * @return {int} a random value between min and max
   *
   * @private
   */
  __randomInt(min, max) {
    const range = Math.abs(max - min);
    min = (min > max ? max : min);
    return Math.floor(this.__randomFloat() * range + min);
  }

  /* eslint-disable max-len */

  /**
   * Generate an array of numbers between 0 and 9
   * Array length = parameter `num`
   *
   * TODO in the Perl version this function was only used to fill a cache of random numbers
   * ? so probably it's not needed anymore.
   *
   * @param {Integer} num - number of random numbers to generate,
   *  defaults to 1 if not given
   * @return {Array}
   * @throws Exception when parameter is not a number
   */
  randomNumbers(num) {
    // default to 1
    if (is.null(num) || is.undefined(num) || num <= 0) {
      num = 1;
    }
    if (is.not.integer(num)) {
      const errMsg = 'Parameter "num" is not an integer! [' + num + ']';
      // log.error('ERROR', errMsg);
      throw new Error(errMsg);
    }
    return new Array(num).fill(0).map(() => this.__randomInt(0, 9));
  }
}

export {RandomBasic};

