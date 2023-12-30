/**
 * This is the main class that interfaces with the webapp
 *
 * @module XKPasswd
 */

import is from 'is-it-check';
import log from 'loglevel';

import {RandomBasic} from './randombasic.mjs';
import {Presets} from './presets.mjs';
import {DictionaryEN} from './dictionaryEN.mjs';

/**
 * Main class
 * @class XKPasswd
 */
class XKPasswd {
  #passwordCounter;

  #preset; // current preset
  #config; // config section of preset, convenience variable
  #rng; // random generator
  #dictionary; // current directory

  /**
   * constructor
   * @constructor
   */
  constructor() {
    this.#preset = new Presets();
    this.#config = this.#preset.config();
    this.#rng = new RandomBasic();
    this.#dictionary = new DictionaryEN();

    // the number of passwords this instance has generated
    this.#passwordCounter = 0;
    log.setLevel('debug');
  }

  /**
   * Set a different preset to work with
   *
   * @param {any} preset
   *
   */
  setPreset(preset) {
    this.#preset = new Presets(preset);
    this.#config = this.#preset.config();
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
      log.trace('starting to generate random words');
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

      switch (this.#config.padding_type) {
      case 'FIXED':
        // simple fixed padding
        passwd = this.__padWithChar(passwd, padChar);
        break;

      case 'ADAPTIVE':
        // adaptive padding
        passwd = this.__adaptivePadding(passwd, padChar,
          this.#config.pad_to_length);
        break;

      default:
        break;
      }
      log.trace(`added padding (as configured): ${passwd}`);


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
   * Pad the password with padChar until the given length
   *
   * @param {string} passwd - password to be padded
   * @param {character} padChar - padding character
   * @param  {integer} maxLen - max length of password
   * @return {string} - padded password
   *
   * @private
   */
  __adaptivePadding(passwd, padChar, maxLen) {
    const pwlen = passwd.length;
    if (pwlen < maxLen) {
      // if the password is shorter than the target length, padd it out
      while (passwd.length < maxLen) {
        passwd += padChar;
      }
    } else if (pwlen > maxLen) {
      // if the password is too long, trim it
      passwd = passwd.substring(0, maxLen);
    }
    return passwd;
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

    const transformation = this.#config.case_transform;

    switch (transformation) {
    case 'NONE':
      // nothing to do, just return
      return words;

    case 'UPPER':
      return words.map((el) => el = el.toUpperCase());

    case 'LOWER':
      return words.map((el) => el = el.toLowerCase());

      return words.map((el) => el = this.toTitleCase(el));
    case 'CAPITALISE':

    case 'INVERT':
      // return words in uppercase but first letter is lowercase
      return words.map((el) =>
        el = el.toUpperCase().
          replaceAll(/(?:^|\s|-)\S/g, (x) => x.toLowerCase()));

    case 'ALTERNATE':
      return words.map((el, index) =>
        el = (index % 2 == 0) ? el.toLowerCase() : el.toUpperCase(),
      );

    case 'RANDOM':
      return words.map((el) =>
        el = (this.#rng.toss()) ? el.toLowerCase() : el.toUpperCase(),
      );

    default:
      return words;
    }
  };

  /**
   * Turn the string into a title case
   * @param {string} str - string to be converted
   * @return {string} - converted string
   */
  toTitleCase(str) {
    return str.toLowerCase().
      replaceAll(/(?:^|\s|-)\S/g, (x) => x.toUpperCase());
  }

  /**
   * Generate a list of random words
   * based on the loaded dictionary
   *
   * Notes: The number of words generated is determined by the num_words
   *        config key.
   *
   * @return {Array} - list of words
   *
   * @private
   */
  __randomWords() {
    const numWords = this.#config.num_words;
    const maxDict = this.#dictionary.getLength();

    log.trace(`about to generate ${numWords} words`);

    const list = new Array(numWords).fill('').map(
      () => this.#dictionary.word(this.#rng.randomInt(maxDict)),
    );
    return list;
  }

  /**
   * Get the separator character to use based on the loaded config.
   *
   * Notes: The character returned is controlled by the config variable
   *  `separator_character`
   *
   * @return {character} separator (could be an empty string)
   *
   * @private
   */
  __separator() {
    // figure out the separator character
    const sep = this.#config.separator_character;

    if (sep == 'NONE') {
      return '';
    }
    if (sep == 'RANDOM') {
      const alphabet = this.#preset.getSeparatorAlphabet();
      return this.#rng.randomChar(alphabet);
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
   * @param {character} separator -
   *  the separator character being used to generate the password
   * @return {character} the padding character, could be an empty string
   *
   * @private
   */
  __paddingChar(separator) {
    if (is.undefined(separator)) {
      separator = '';
    }

    switch (this.#config.padding_character) {
    case 'NONE':
      return '';
    case 'SEPARATOR':
      return separator;
    case 'RANDOM':
      const alphabet = this.#preset.getPaddingAlphabet();
      return this.#rng.randomChar(alphabet);
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
    if (this.#config.padding_digits_before > 0) {
      passwd = this.#rng.randomDigits(this.#config.padding_digits_before) +
        separator + passwd;
    }
    if (this.#config.padding_digits_after > 0) {
      passwd = passwd + separator +
        this.#rng.randomDigits(this.#config.padding_digits_after);
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
    if (this.#config.padding_characters_before > 0) {
      for (let c = 1; c <= this.#config.padding_characters_before; c++) {
        passwd = padChar + passwd;
      }
    }
    if (this.#config.padding_characters_after > 0) {
      for (let c = 1; c <= this.#config.padding_characters_after; c++) {
        passwd += padChar;
      }
    }
    return passwd;
  }
}

export {XKPasswd};
