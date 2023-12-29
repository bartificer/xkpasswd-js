/**
 * This is the main class that interfaces with the webapp
 *
 * @module XKPasswd
 */

import {RandomBasic} from './randombasic.mjs';
import {Presets} from './presets.mjs';
import is from 'is-it-check';
import log from 'loglevel';

/**
 * Main class
 * @class XKPasswd
 */
class XKPasswd {
  #passwordCounter;

  /**
   * constructor
   */
  constructor() {
    this.__preset = new Presets();
    this.__config = this.__preset.config();
    this.__description = this.__preset.description();
    this.__rng = new RandomBasic();
    this.__dictionary = [];

    // the number of passwords this instance has generated
    this.#passwordCounter = 0;
    log.setLevel('debug');
  }

  /**
   * Return a password that adheres to the
   * chosen preset
   *
   * @return {string}
   */
  password() {
    let passwd = '';
    try {
      //
      // start by generating the needed parts of the password
      //
      log.debug('starting to generate random words');
      const words = this.__randomWords();
      log.trace(`got random words = ${words}`);

      this.__transformCase(words);
      this.__substituteCharacters(words);
      const separator = this.__separator();
      log.trace(`got separator = ${separator}`);

      const padChar = this.__paddingChar(separator);
      log.trace(`got padChar = ${padChar}`);

      //
      // Then assemble the finished password
      //

      // start with the words and the separator
      passwd = words.join(separator);
      log.trace(`assembled base password: ${passwd}`);

      // next add the numbers front and back

      passwd = this.__padWithDigits(passwd, separator);
      log.trace(`added random digits (as configured): ${passwd}`);

      // then finally add the padding characters

      if (this.__config.padding_type == 'FIXED') {
        // simple fixed padding
        passwd = this.__padWithChar(passwd, padChar);
      } else {
        if (this.__config.padding_type == 'ADAPTIVE') {
          // adaptive padding
          const pwlen = passwd.length;
          if (pwlen < this.__config.pad_to_length) {
            // if the password is shorter than the target length, padd it out
            while (passwd.length < this.__config.pad_to_length) {
              passwd += padChar;
            }
          } else
            if (pwlen > this.__config.pad_to_length) {
              // if the password is too long, trim it
              passwd = passwd.substring(0, this.__config.pad_to_length);
            }
        }
        log.debug(`added padding (as configured): ${passwd}`);
      }


      // return the finished password
      return passwd;
    } catch (e) {
      log.error(
        `Failed to generate password with the following error: ${e}`,
      );
    };

    // increment the passwords generated counter
    this.#passwordCounter++;
  }

  /**
   * Apply the case transform (if any) specified in the loaded config.
   *
   * Notes:
   * - The transformations applied are controlled by the case_transform
   *   config variable.
   * - Treat this as a private function
   *
   * @param {array} words - array of words to be transformed
   * @return {array} - array of transformed words
   * @throws exception when there is a problem
   */
  __transformCase(words) {
    // validate args
    if (is.undefined(words) || is.not.array(words)) {
      throw new Error('parameter words is not an array');
    }

    const transformation = this.__config.case_transform;

    switch (transformation) {
    case 'NONE':
      // nothing to do, just return
      return words;

    case 'UPPER':
      return words.forEach((element) => {
        element = element.toUpperCase();
      });
    case 'LOWER':
      return words.forEach((element) => {
        element = element.toLowerCase();
      });
    case 'CAPITALIZE':
      return words.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
      });
    case 'INVERT':
      // return words in uppercase but first letter is lowercase
      return words.toUpperCase().replace(/\b[A-Z]/g, function(letter) {
        return letter.toLowerCase();
      });
    case 'ALTERNATE':
      return words.forEach((element, index) => {
        if (index % 2 == 0) {
          element = element.toLowerCase();
        } else {
          element = element.toUpperCase();
        }
      });
    case 'RANDOM':
      return words.forEach((element) => {
        if (this.__rng.toss()) {
          element = element.toLowerCase();
        } else {
          element = element.toUpperCase();
        }
      });
    default:
      break;
    }
  }

  /**
   * Generate a list of random words
   * based on the loaded dictionary
   *
   * Notes: The number of words generated is determined by the num_words
   *        config key.
   *
   *
   * This is an internal function
   *
   * @return {Array} - list of words
   */
  __randomWords() {
    const numWords = this.__config.num_words;
    const maxDict = this.__dictionary.length;

    log.debug(`about to generate ${numWords} words`);

    let list = new Array(numWords).fill('').map(
      () => this.__dictionary[this.__rng.randomInt(maxDict)],
    );
    list = ['apple', 'mac', 'ipad'];
    return list;
  }

  /**
   * Get the separator character to use based on the loaded config.
   *
   * Notes: The character returned is controlled by the config variable
   *  `separator_character`
   * This is an internal function
   *
   * @return {character} separator (could be an empty string)
   */
  __separator() {
    // figure out the separator character
    const sep = this.__config.separator_character;

    if (sep == 'NONE') {
      return '';
    }
    if (sep == 'RANDOM') {
      const alphabet = this.__preset.getSeparatorAlphabet();
      return this.__rng.randomChar(alphabet);
    }
    return '';
  }

  /**
   * Return the padding character based on the loaded config.
   *
   * Notes:
   *  The character returned is determined by a combination of the
   *  padding_type & padding_character config variables.
   *
   * This is an internal function
   *
   * @param {character} separator -
   *  the separator character being used to generate the password
   * @return {character} the padding character, could be an empty string
   */
  __paddingChar(separator) {
    if (is.undefined(separator)) {
      separator = '';
    }

    switch (this.__config.padding_character) {
    case 'NONE':
      return '';
    case 'SEPARATOR':
      return separator;
    case 'RANDOM':
      const alphabet = this.__preset.getPaddingAlphabet();
      return this.__rng.randomChar(alphabet);
    default:
      return '';
    }
  }


  /**
   * Substitute characters
   *
   * TODO - should this be implemented? there is no config option for it
   * @param {any} words
   * @return {any}
   */
  __substituteCharacters(words) {
    return words;
  }

  /**
   * Pad the password with random digits
   *
   * @param {any} passwd
   * @param {any} separator
   * @return {any} - the padded password
   */
  __padWithDigits(passwd, separator) {
    if (this.__config.padding_digits_before > 0) {
      passwd = this.__rng.randomDigits(this.__config.padding_digits_before) +
        separator + passwd;
    }
    if (this.__config.padding_digits_after > 0) {
      passwd = passwd + separator +
        this.__rng.randomDigits(this.__config.padding_digits_after);
    }
    return passwd;
  }

  /**
   * Pad the password with pad character
   *
   * @param {any} passwd
   * @param {any} padChar
   * @return {any} - the padded password
   */
  __padWithChar(passwd, padChar) {
    if (this.__config.padding_characters_before > 0) {
      for (let c = 1; c <= this.__config.padding_characters_before; c++) {
        passwd = padChar + passwd;
      }
    }
    if (this.__config.padding_characters_after > 0) {
      for (let c = 1; c <= this.__config.padding_characters_after; c++) {
        passwd += padChar;
      }
    }
    return passwd;
  }
}

export {XKPasswd};
