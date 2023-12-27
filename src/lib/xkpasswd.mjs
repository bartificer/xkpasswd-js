/**
 * This is the main class that interfaces with the webapp
 *
 * @module XKPasswd
 */

import * as randomString from 'randomstring';

/**
 * Main class
 * @class XKPasswd
 */
class XKPasswd {
  /**
 * Return a password
 *
 * @return {string}
 */
  password() {
    const randomStr = randomString.generate();
    return randomStr;
  }
}

export {XKPasswd};
