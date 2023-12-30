/**
 * Abstract class to implement various dictionaries
 *
 * @namespace XKP
 * @module Dictionary
 */

/**
 * class for a Dictionary
 * @class
 */
class Dictionary {
  #wordListLength; // length of the word list, convenience variable

  /**
   * Constructor for English Dictionary
   * @constructor
   */
  constructor() {
    if (this.constructor == Dictionary) {
      throw new Error('You cannot instantiate the abstract class');
    }
    this.#wordListLength = 0;
  }


  /**
   * Clone thyself
   * TODO do we really need this?
   * @return {any}
   */
  // clone() {
  //   return this;
  // }

  /**
   * Return the word list of the dictionary
   *
   * @return {Array} - list of words
   */
  wordList() {
    return null;
  }

  /**
   * Return a word from the list
   *
   * @param {integer} index
   * @return {string} - the word at the index position
   */
  word(index) {
    return null;
  }

  /**
   * Return the length of the word list
   *
   * @return {integer} - length of the word list
   */
  getLength() {
    return this.#wordListLength;
  }

  /**
   * Set the length of the word list
   *
   * @param {integer} len - length of the list
   *
   * @private
   */
  __setLength(len) {
    this.#wordListLength = len;
  }
}

export {Dictionary};
