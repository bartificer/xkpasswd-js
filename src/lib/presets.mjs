/**
 * Class with all presets
 *
 * @module Presets
 */

import {RandomBasic} from './randombasic.mjs';
import is from 'is-it-check';
import log from 'loglevel';

/**
 * This object contains all predefined config sets
 */
const thePresets = {
  DEFAULT: {
    description:
      'The default preset resulting in a password consisting of ' +
      '3 random words of between 4 and 8 letters with alternating ' +
      'case separated by a random character, with two random digits ' +
      'before and after, and padded with two random characters front and back',
    config: {
      // eslint-disable-next-line max-len
      symbol_alphabet: '! @ $ % ^ & * - _ + = : | ~ ? / . ;'.split(' '),
      word_length_min: 4,
      word_length_max: 8,
      num_words: 3,
      separator_character: 'RANDOM',
      padding_digits_before: 2,
      padding_digits_after: 2,
      padding_type: 'FIXED',
      padding_character: 'RANDOM',
      padding_characters_before: 2,
      padding_characters_after: 2,
      case_transform: 'ALTERNATE',
      random_function: RandomBasic,
      random_increment: 'AUTO',
    },
  },
  WEB32: {
    description:
      'A preset for websites that allow passwords up to 32 characteres long.',
    config: {
      padding_alphabet: '! @ $ % ^ & * + = : | ~ '.split(' '),
      separator_alphabet: '- + = . * _ | ~ '.split(' '),
      word_length_min: 4,
      word_length_max: 5,
      num_words: 4,
      separator_character: 'RANDOM',
      padding_digits_before: 2,
      padding_digits_after: 2,
      padding_type: 'FIXED',
      padding_character: 'RANDOM',
      padding_characters_before: 1,
      padding_characters_after: 1,
      case_transform: 'ALTERNATE',
      allow_accents: 0,
    },
  },
  WEB16: {
    description:
      'A preset for websites that insist passwords not be longer ' +
      'than 16 characters. WARNING - only use this preset if you ' +
      'have to, it is too short to be acceptably secure and will ' +
      'always generate entropy warnings for the case where the ' +
      'config and dictionary are known.',
    config: {
      symbol_alphabet: '! @ $ % ^ & * - _ + = : | ~ ? / . '.split(' '),
      word_length_min: 4,
      word_length_max: 4,
      num_words: 3,
      separator_character: 'RANDOM',
      padding_digits_before: 0,
      padding_digits_after: 2,
      padding_type: 'NONE',
      case_transform: 'RANDOM',
      allow_accents: 0,
    },
  },
  WIFI: {
    description:
      'A preset for generating 63 character long WPA2 keys ' +
      '(most routers allow 64 characters, but some only 63, ' +
      'hence the odd length).',
    config: {
      padding_alphabet: '! @ $ % ^ & * + = : | ~ ?'.split(' '),
      separator_alphabet: '- + = . * _ | ~ ,'.split(' '),
      word_length_min: 4,
      word_length_max: 8,
      num_words: 6,
      separator_character: 'RANDOM',
      padding_digits_before: 4,
      padding_digits_after: 4,
      padding_type: 'ADAPTIVE',
      padding_character: 'RANDOM',
      pad_to_length: 63,
      case_transform: 'RANDOM',
      allow_accents: 0,
    },
  },
  APPLEID: {
    description:
      'A preset respecting the many prerequisites Apple places ' +
      'on Apple ID passwords. The preset also limits itself to ' +
      'symbols found on the iOS letter and number keyboards ' +
      '(i.e. not the awkward to reach symbol keyboard)',
    config: {
      padding_alphabet: '- : . ! ? @ &'.split(' '),
      separator_alphabet: '- : . @ } '.split(' '),
      word_length_min: 4,
      word_length_max: 7,
      num_words: 3,
      separator_character: 'RANDOM',
      padding_digits_before: 2,
      padding_digits_after: 2,
      padding_type: 'FIXED',
      padding_character: 'RANDOM',
      padding_characters_before: 1,
      padding_characters_after: 1,
      case_transform: 'RANDOM',
      allow_accents: 0,
    },
  },
  NTLM: {
    description:
      'A preset for 14 character Windows NTLMv1 password. ' +
      'WARNING - only use this preset if you have to, it is ' +
      'too short to be acceptably secure and will always ' +
      'generate entropy warnings for the case where the config ' +
      'and dictionary are known.',
    config: {
      padding_alphabet: '! @ $ % ^ & * + = : | ~ ?'.split(' '),
      separator_alphabet: '- + = . * _ | ~, '.split(' '),
      word_length_min: 5,
      word_length_max: 5,
      num_words: 2,
      separator_character: 'RANDOM',
      padding_digits_before: 1,
      padding_digits_after: 0,
      padding_type: 'FIXED',
      padding_character: 'RANDOM',
      padding_characters_before: 0,
      padding_characters_after: 1,
      case_transform: 'INVERT',
      allow_accents: 0,
    },
  },
  SECURITYQ: {
    description: 'A preset for creating fake answers to security questions.',
    config: {
      word_length_min: 4,
      word_length_max: 8,
      num_words: 6,
      separator_character: ' ',
      padding_digits_before: 0,
      padding_digits_after: 0,
      padding_type: 'FIXED',
      padding_character: 'RANDOM',
      padding_alphabet: '. ! ?'.split(' '),
      padding_characters_before: 0,
      padding_characters_after: 1,
      case_transform: 'NONE',
      allow_accents: 0,
    },
  },
  XKCD: {
    description:
      'A preset for generating passwords similar ' +
      'to the example in the original XKCD cartoon, ' +
      'but with an extra word, a dash to separate ' +
      'the random words, and the capitalisation randomised ' +
      'to add sufficient entropy to avoid warnings.',
    config: {
      word_length_min: 4,
      word_length_max: 8,
      num_words: 5,
      separator_character: '-',
      padding_digits_before: 0,
      padding_digits_after: 0,
      padding_type: 'NONE',
      case_transform: 'RANDOM',
      allow_accents: 0,
    },
  },
};


/**
 * Class that handles all presets
 *
 * @class Presets
 */
class Presets {
  // private var holds the current preset
  #current;
  #presetName;
  #presets = Object.keys(thePresets);

  /**
   * Constructor: set either the default preset
   * or a preset that is passed in.
   *
   * If the preset parameter matches one of the
   * predefined sets, use that, otherwise
   * assume it's a custom configuration.
   *
   * @constructor
   *
   * @param {any} preset - either string with
   * name of predefined set or object with
   * configuration parameters
   */
  constructor(preset) {
    /*
     * if preset is undefined -> DEFAULT
     * if preset is string
     *   -> if preset is found in thePresets
     *      -> the found preset
     *      -> else DEFAULT
     * if preset is object
     *  -> set this config to this object
     *
     * if all this fails -> DEFAULT
     *
     */
    if (is.undefined(preset)) {
      this.#current = thePresets.DEFAULT;
      this.#presetName = 'DEFAULT';
    } else {
      if (is.string(preset)) {
        preset = preset.toUpperCase();
        if (this.#presets.indexOf(preset) > -1) {
          this.#current = thePresets[preset];
          this.#presetName = preset;
        } else {
          this.#current = thePresets.DEFAULT;
          this.#presetName = 'DEFAULT';
        }
      } else {
        if (is.object(preset)) {
          this.#current = preset;
          this.#presetName = 'CUSTOM';
        } else {
          this.#current = thePresets.DEFAULT;
          this.#presetName = 'DEFAULT';
        }
      }
    };

    // fix the padding and separator alphabet
    this.#current.config.separator_alphabet = this.getSeparatorAlphabet();
    this.#current.config.padding_alphabet = this.getPaddingAlphabet();

    log.trace(`Preset constructor set to ${this.#presetName}`);
  }


  /**
   * Get the default preset
   *
   * @return {object} - the preset
   */
  static getDefault() {
    return thePresets.DEFAULT;
  }

  /**
   * Get the current preset
   * @return {object} - the preset
   */
  getCurrent() {
    return this.#current;
  }

  /**
   * Get the config part of the current preset
   *
   * @return {object} - the preset
   */
  config() {
    return this.#current.config;
  }

  /**
   * Get the description of the preset
   *
   * @return {string} - the description of the preset
   */
  description() {
    return this.#current.description;
  }

  /**
   * Get the name of the preset, e.g. DEFAULT
   *
   * @return {string} - the name of the preset
   */
  name() {
    return this.#presetName;
  }

  /**
   * Get the list of available presets
   *
   * @return {Array} keys of presets
   */
  getPresets() {
    return this.#presets;
  }

  /**
   * Get the list of separator characters
   * or default to the list of symbol characters
   *
   * @return {Array} the list of characters
   */
  getSeparatorAlphabet() {
    let alphabet =
        (is.not.undefined(this.#current.config.separator_alphabet) ?
          this.#current.config.separator_alphabet :
          this.#current.config.symbol_alphabet);
    alphabet = ((is.undefined(alphabet) || (alphabet.length === 0)) ?
      thePresets.DEFAULT.config.symbol_alphabet : alphabet);
    return alphabet;
  }

  /**
   * Get the list of padding characters
   * or default to the list of symbol characters
   *
   * @return {Array} the list of characters
   */
  getPaddingAlphabet() {
    let alphabet =
          (is.not.undefined(this.#current.config.padding_alphabet) ?
            this.#current.config.padding_alphabet :
            this.#current.config.symbol_alphabet);
    alphabet = ((is.undefined(alphabet) || (alphabet.length === 0)) ?
      thePresets.DEFAULT.config.symbol_alphabet : alphabet);
    return alphabet;
  }
}

export {Presets};
