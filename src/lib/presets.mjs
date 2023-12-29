/**
 * Class with all presets
 *
 * @module Presets
 */

import {RandomBasic} from './randombasic.mjs';
import is from 'is-it-check';

/**
 * This object contains all predefined config sets
 */
const presets = {
  DEFAULT: {
    // eslint-disable-next-line max-len
    description: 'The default preset resulting in a password consisting of 3 random words of between 4 and 8 letters with alternating case separated by a random character, with two random digits before and after, and padded with two random characters front and back',
    config: {
      // eslint-disable-next-line max-len
      symbol_alphabet: ['!', '@', '$', '%', '^', '&', '*', '-', '_', '+', '=', ':', '|', '~', '?', '/', '.', ';'],
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
};

/**
 * Class that handles all presets
 */
class Presets {
  // private var holds the current preset
  #current;
  #presetName;

  /**
   * Constructor: set either the
   * default preset or a preset
   * that is passed in.
   * @constructor
   *
   * @param {object} preset
   */
  constructor(preset) {
    if (is.undefined(preset)) {
      this.#current = presets.DEFAULT;
      this.#presetName = 'DEFAULT';
    } else {
      this.#current = preset;
      this.#presetName = 'CUSTOM';
    }
  }
  /**
   * Get the default preset
   *
   * @return {object} - the preset
   */
  static getDefault() {
    return presets.DEFAULT;
  }

  /**
   * Get the current preset
   * @return {object} - the preset
   */
  getCurrent() {
    return this.#current;
  }

  /**
   * Get the config part of the preset
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
   * Get the name of the preset
   *
   * @return {string} - the name of the preset
   */
  name() {
    return this.#presetName;
  }


  /**
   * Get the list of separator characters
   * or default to the list of symbol characters
   *
   * @return {Array} the list of characters
   */
  getSeparatorAlphabet() {
    const alphabet =
        (is.not.undefined(this.#current.config.separator_alphabet) ?
          this.#current.config.separator_alphabet :
          this.#current.config.symbol_alphabet);
    return alphabet;
  }

  /**
   * Get the list of padding characters
   * or default to the list of symbol characters
   *
   * @return {Array} the list of characters
   */
  getPaddingAlphabet() {
    const alphabet =
          (is.not.undefined(this.#current.config.padding_alphabet) ?
            this.#current.config.padding_alphabet :
            this.#current.config.symbol_alphabet);
    return alphabet;
  }
};

export {Presets};
