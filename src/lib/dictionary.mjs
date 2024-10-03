/**
 * Generic class to implement various dictionaries
 *
 * @module lib/Dictionary
 * @abstract
 */

import log from 'loglevel';
/**
 * Class for a Dictionary. This class should not be instantiated
 * but rather used to extended with various dictionaries. This class
 * provides the necessary functions to use the dictionary.
 *
 * @class Dictionary
 * @constructor
 */
class Dictionary {
  #wordListLength; // length of the word list, convenience variable
  #minWordLength; // shortest word length
  #maxWordLength; // longest word length

  /**
   * Constructor for the Dictionary class.
   * This class is abstract and cannot be instantiated directly.
   *
   * @throws {Error} Will throw an error if attempted to instantiate.
   * @constructor
   */
  constructor() {
    if (this.constructor === Dictionary) {
      throw new Error('You cannot instantiate the abstract class');
    }
    this.#wordListLength = 0;
    this.#minWordLength = 0;
    this.#maxWordLength = 0;
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
   * @param {number} index
   * @return {string} - the word at the index position
   */
  word(index) {
    return '';
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
   * Get the length of the shortest word in the list
   *
   * @return {number} - length
   */
  getMinWordLength() {
    return this.#minWordLength;
  }

  /**
   * Get the length of the largest word in the list
   * @return {number} - length
   */
  getMaxWordLength() {
    return this.#maxWordLength;
  }

  /**
   * Find the list of words with a length that
   * falls in the range of the min and max parameters
   *
   * @param {number} minLen - minimum length
   * @param {number} maxLen - maximum length
   * @return {Array} - list of filtered words
   */
  filteredWordList(minLen, maxLen) {
    const maxDict = this.getLength();

    // if undefined, make it 0
    minLen = minLen ? minLen : 0;
    maxLen = maxLen ? maxLen : 0;
    // get the minimum of the 2 input variables
    const minLength = Math.min(minLen, maxLen);

    // get the maximum of the 2 input variables
    const maxLength = Math.max(minLen, maxLen);

    log.trace(`about to filter words with ${minLength} - ${maxLength}`);

    const list = [];
    let word = '';
    for (let i = 0; i < maxDict; i++) {
      word = this.word(i);
      if (word.length >= minLength && word.length <= maxLength) {
        list.push(word);
      }
    }
    log.trace(`pushed words: ${list.length}`);
    return list;
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

  /**
   * Set the word length min and max values
   *
   * @private
   */
  __setWordLength() {
    const list = this.wordList();
    let minlen = list[0].length;
    let maxlen = minlen;
    for (let i = 1; i < this.#wordListLength; i++) {
      minlen = Math.min(minlen, list[i].length);
      maxlen = Math.max(maxlen, list[i].length);
    }
    this.#minWordLength = minlen;
    this.#maxWordLength = maxlen;
  }
}

export {Dictionary};
