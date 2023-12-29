/**
 * This is the main class that interfaces with the webapp
 *
 * @module XKPasswd
 */

import { RandomBasic } from './randombasic.mjs';
import is from 'is-it-check';
import log from 'loglevel';
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
    log.setLevel('debug');
  }
  /**
   * Return a password
   *
   * @return {string}
   */
  password() {
    const randomStr = this.__rng.randomNumbers(10);
    return randomStr;
      log.debug('starting to generate random words');
      log.trace(`got random words = ${words}`);
      log.trace(`got separator = ${separator}`);
      log.trace(`got padChar = ${padChar}`);
      log.trace(`assembled base password: ${passwd}`);
      log.trace(`added random digits (as configured): ${passwd}`);
        log.debug(`added padding (as configured): ${passwd}`);
  }
}

export {XKPasswd};
