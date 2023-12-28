/**
 * This is the main class that interfaces with the webapp
 *
 * @module XKPasswd
 */

import { RandomBasic } from './randombasic.mjs';
/**
 * Main class
 * @class XKPasswd
 */
class XKPasswd {
  /**
   * constructor
   */
  constructor() {
    this.__rng = new RandomBasic();
  }
  /**
   * Return a password
   *
   * @return {string}
   */
  password() {
    const randomStr = this.__rng.randomNumbers(10);
    return randomStr;
  }
}

export {XKPasswd};
