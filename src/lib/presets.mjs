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
/* 2024-03-02 this is the original configuration setup
 * it gives a lot of problems
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
      'A preset for websites that allow passwords up to 32 characters long.',
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
      separator_alphabet: '- + = . * _ | ~ ,'.split(' '),
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
*/

const thePresets = {
  DEFAULT: {
    description:
      'The default preset resulting in a password consisting of ' +
      '3 random words of between 4 and 8 letters with alternating ' +
      'case separated by a random character, with two random digits ' +
      'before and after, and padded with two random characters front and back.',
    config: {
      // eslint-disable-next-line max-len
      symbol_alphabet: '!@$%^&*-_+=:|~?/.;',
      word_length_min: 4,
      word_length_max: 8,
      num_words: 3,
      case_transform: 'CAPITALISE',
      separator_type: 'RANDOM',
      padding_digits_before: 2,
      padding_digits_after: 2,
      padding_type: 'FIXED',
      padding_character_type: 'RANDOM',
      padding_characters_before: 2,
      padding_characters_after: 2,
      random_function: RandomBasic,
      random_increment: 'AUTO',
    },
  },
  WEB32: {
    description:
      'A preset for websites that allow passwords up to 32 characters long.',
    config: {
      word_length_min: 4,
      word_length_max: 5,
      num_words: 4,
      case_transform: 'ALTERNATE',
      separator_type: 'RANDOM',
      separator_alphabet: '-+=.*_|~',
      padding_digits_before: 2,
      padding_digits_after: 2,
      padding_type: 'FIXED',
      padding_character_type: 'RANDOM',
      padding_alphabet: '!@$%^&*+=:|~',
      padding_characters_before: 1,
      padding_characters_after: 1,
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
      symbol_alphabet: '!@$%^&*-_+=:|~?/.',
      word_length_min: 4,
      word_length_max: 4,
      num_words: 3,
      case_transform: 'RANDOM',
      separator_type: 'RANDOM',
      padding_type: 'NONE',
      padding_digits_before: 0,
      padding_digits_after: 2,
      allow_accents: 0,
    },
  },
  WIFI: {
    description:
      'A preset for generating 63 character long WPA2 keys ' +
      '(most routers allow 64 characters, but some only 63, ' +
      'hence the odd length).',
    config: {
      word_length_min: 4,
      word_length_max: 8,
      num_words: 6,
      case_transform: 'RANDOM',
      separator_type: 'RANDOM',
      separator_alphabet: '-+=.*_|~,',
      padding_type: 'ADAPTIVE',
      pad_to_length: 63,
      padding_digits_before: 4,
      padding_digits_after: 4,
      padding_character_type: 'RANDOM',
      padding_alphabet: '!@$%^&*+=:|~?',
      allow_accents: 0,
    },
  },
  APPLEID: {
    description:
      'A preset respecting the many prerequisites Apple places ' +
      'on Apple ID passwords. The preset also limits itself to ' +
      'symbols found on the iOS letter and number keyboards ' +
      '(i.e. not the awkward to reach symbol keyboard).',
    config: {
      word_length_min: 4,
      word_length_max: 7,
      num_words: 3,
      case_transform: 'RANDOM',
      separator_type: 'RANDOM',
      separator_alphabet: '-:.@}',
      padding_type: 'FIXED',
      padding_digits_before: 2,
      padding_digits_after: 2,
      padding_character_type: 'RANDOM',
      padding_characters_before: 1,
      padding_characters_after: 1,
      padding_alphabet: '-:.!?@&',
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
      word_length_min: 5,
      word_length_max: 5,
      num_words: 2,
      case_transform: 'INVERT',
      separator_type: 'RANDOM',
      separator_alphabet: '-+=.*_|~,',
      padding_digits_before: 1,
      padding_digits_after: 0,
      padding_type: 'FIXED',
      padding_character_type: 'RANDOM',
      padding_characters_before: 0,
      padding_characters_after: 1,
      padding_alphabet: '!@$%^&*+=:|~?',
      allow_accents: 0,
    },
  },
  SECURITYQ: {
    description: 'A preset for creating fake answers to security questions.',
    config: {
      word_length_min: 4,
      word_length_max: 8,
      num_words: 6,
      case_transform: 'NONE',
      separator_type: 'FIXED',
      separator_character: ' ',
      padding_digits_before: 0,
      padding_digits_after: 0,
      padding_type: 'FIXED',
      padding_character_type: 'RANDOM',
      padding_alphabet: '.!?',
      padding_characters_before: 0,
      padding_characters_after: 1,
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
      case_transform: 'RANDOM',
      separator_type: 'FIXED',
      separator_character: '-',
      padding_type: 'NONE',
      padding_digits_before: 0,
      padding_digits_after: 0,
      allow_accents: 0,
    },
  },
  TEMPORARY: {
    description: 'A preset for creating temporary phone friendly passwords.' +
      ' WARNING - They are not secure and should be changed immediately.',
    config: {
      word_length_min: 4,
      word_length_max: 4,
      num_words: 2,
      case_transform: 'CAPITALISE',
      separator_type: 'FIXED',
      separator_character: '-',
      padding_digits_before: 0,
      padding_digits_after: 2,
      padding_type: 'NONE',
      allow_accents: 0,
    },
  },
  CUSTOM: {
    description: 'A preset loaded from configuration.',
    config: {
      word_length_min: 4,
      word_length_max: 4,
      num_words: 2,
      case_transform: 'CAPITALISE',
      separator_type: 'FIXED',
      separator_character: '-',
      padding_digits_before: 0,
      padding_digits_after: 2,
      padding_type: 'NONE',
      allow_accents: 0,
    },
  },
};


/**
 * Class that handles all presets
 *
 *  A preset is an object that defines a predefined set of
 * configurable settings.
 * A preset object consists of 3 parts:
 * * name - the name of the preset,
 *  which is just the object index in the list
 * * description - a description of the preset
 * * config - the set of configurable settings
 *
 * The configurable settings are described in the documentation.
 *
 * @class Presets
 */
class Presets {
  // private var holds the current preset
  #current;
  #presetName;
  #presets = Object.keys(thePresets);
  #max_alphabet = 20;

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
    }

    this.#current.config = this.__normalize(this.#current.config);

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

  setConfig(settings) {
    this.#current.config = this.__normalize(settings);
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
   * Normalize the config object
   *
   * This means that all elements of the config are present and set
   * to a default. This makes the values of all properties much more
   * consistent for use later on.
   *
   * @private
   *
   * @param {Object} config - object with properties set
   * @return {Object} - the normalized config
   */
  __normalize(config) {
    // create a clone, so we can safely reference the original value
    const newConfig = {...config};

    // set the min and max word lengths
    const [min, max] = this.__getMinMaxWordLength(
      config.min_word_length, config.max_word_length);
    newConfig.min_word_length = min;
    newConfig.max_word_length = max;

    // make sure num_words >= 2
    newConfig.num_words = Math.max(2, config.num_words);

    // get the separator configuration
    const {separatorType,
      separatorCharacter,
      separatorAlphabet} = this.__getSeparatorConfig(config);

    newConfig.separator_type = separatorType;
    newConfig.separator_character = separatorCharacter;
    newConfig.separator_alphabet = separatorAlphabet;

    // get the padding character configuration
    const {paddingCharType,
      paddingCharacter,
      paddingAlphabet} = this.__getPaddingCharacterConfig(config);

    newConfig.padding_character_type = paddingCharType;
    newConfig.padding_character = paddingCharacter;
    newConfig.padding_alphabet = paddingAlphabet;

    // parse number fields to integers
    Object.keys(newConfig).forEach(key => {
      if (
        key == 'word_length_min' || key == 'word_length_max' ||
        key == 'padding_digits_before' || key == 'padding_digits_after' ||
        key == 'padding_characters_before' || key == 'padding_characters_after' ||
        key == 'num_words' || key == 'pad_to_length'
      ) {
        newConfig[key] = parseInt(newConfig[key]);
      }
    });

    return newConfig;
  }

  /**
   * Get the list of separator characters
   * or default to the list of symbol characters
   *
   * @private
   *
   * @param {object} config - the config to test
   * @return {string} the list of characters
   */
  __getSeparatorAlphabet(config) {
    // if there is no parameter, use the current config
    const tmpConfig =
      (is.undefined(config)) ? this.#current.config : config;

    let alphabet =
        (tmpConfig.separator_alphabet ?
          tmpConfig.separator_alphabet :
          tmpConfig.symbol_alphabet);

   return this.__configureAlphabet(alphabet);
  }

  /**
   * Get the list of padding characters
   * or default to the list of symbol characters
   *
   * @private
   *
   * @param {object} config - the config to test
   * @return {string} the list of characters
   */
  __getPaddingAlphabet(config) {
    // if there is no parameter, use the current config
    const tmpConfig =
      (is.undefined(config)) ? this.#current.config : config;

    let alphabet =
          (is.not.undefined(tmpConfig.padding_alphabet) ?
            tmpConfig.padding_alphabet :
            tmpConfig.symbol_alphabet);

    return this.__configureAlphabet(alphabet);
  }

  /**
   * Helper function to configure the alphabet
   * or default to the DEFAULT.symbol_alphabet
   *
   * @private
   *
   * @param {array|string} alphabet - the alphabet to configure
   * @return {string} - the alphabet as string
   */
  __configureAlphabet(alphabet) {
      alphabet = ((alphabet === undefined || (alphabet.length === 0)) ?
      thePresets.DEFAULT.config.symbol_alphabet : alphabet);

    // make sure the alphabet is not longer than the max length
    return is.array(alphabet) ?
      alphabet.join('').substring(0, this.#max_alphabet) :
      alphabet.substring(0, this.#max_alphabet);
  }

  /**
   * Get the min and max word length
   *
   * @private
   *
   * @param {number} min - minimum word length
   * @param {number} max - maximum word length
   * @return {object} - min and max numbers
   */
  __getMinMaxWordLength(min, max) {
    // make sure min and max are in the right order
    // only positive values >= 3 (see documentation)
    let minLength = Math.max(3, min);
    let maxLength = Math.max(3, max);

    // make sure min and max are not reversed
    const tmp = Math.min(minLength, maxLength);
    maxLength = Math.max(minLength, maxLength);
    minLength = tmp;

    return [minLength, maxLength];
  }

  /**
   * Get the separator configuration
   *
   * @param {object} config - the config to fix
   *
   * @return {object} - the object with the normalized properties
   */
  __getSeparatorConfig(config) {
    const newConfig = {};

    /* old config:
        - separator_character = NONE, RANDOM or char
        - separator_type does not exist

      new config:
        - separator_character = '' or char
        - separator_type = NONE, RANDOM or FIXED
    */

    if (is.undefined(config.separator_type)) {
      // we should be in the old config
      switch (config.separator_character) {
      case undefined:
      case 'NONE':
        newConfig.separatorType = 'NONE';
        newConfig.separatorCharacter = '';
        break;
      case 'RANDOM':
        newConfig.separatorType = 'RANDOM';
        newConfig.separatorCharacter = '';
        break;
      default:
        if (config.separator_character.length > 1) {
          throw new Error(
            `Unknown separator code (${config.separator_character}) found`);
        }
        newConfig.separatorType = 'FIXED';
        newConfig.separatorCharacter = config.separator_character;
      }
    } else {
      // we should be in the new config
      switch (config.separator_type) {
      case 'NONE':
      case 'RANDOM':
        newConfig.separatorType = config.separator_type;
        newConfig.separatorCharacter = '';
        break;
      case 'FIXED':
        if (is.undefined(config.separator_character) ||
          config.separator_character.length > 1) {
          throw new Error(
            // eslint-disable-next-line max-len
            `Multiple or unknown separator character(s) (${config.separator_character}) found`);
        }
        newConfig.separatorType = 'FIXED';
        newConfig.separatorCharacter = config.separator_character;
        break;
      default:
        throw new Error(
          `Unknown separator code (${config.separator_type}) found`);
      }
    }
    newConfig.separatorAlphabet = this.__getSeparatorAlphabet(config);

    log.trace(`returning config: ${JSON.stringify(config)}`);
    return newConfig;
  }

  /**
   * Get the padding character configuration
   *
   * @param {object} config - the config to fix
   *
   * @return {object} - the object with the normalized properties
   */
  __getPaddingCharacterConfig(config) {
    const newConfig = {};

    if (is.undefined(config.padding_character_type)) {
      // we should be in the old config
      switch (config.padding_character) {
      case undefined:
      case 'NONE':
        newConfig.paddingCharType = 'NONE';
        newConfig.paddingCharacter = '';
        break;
      case 'RANDOM':
        newConfig.paddingCharType = 'RANDOM';
        newConfig.paddingCharacter = '';
        break;
      case 'SEPARATOR':
        newConfig.paddingCharType = 'SEPARATOR';
        newConfig.paddingCharacter = config.separator_character;
        break;
      default:
        if (config.padding_character.length > 1) {
          throw new Error(
            `Unknown padding code (${config.padding_character}) found`);
        }
        newConfig.paddingCharType = 'FIXED';
        newConfig.paddingCharacter = config.padding_character;
      }
    } else {
      // we should be in the new config
      switch (config.padding_character_type) {
      case 'NONE':
      case 'RANDOM':
        newConfig.paddingCharType = config.padding_character_type;
        newConfig.paddingCharacter = '';
        break;
      case 'SEPARATOR':
        newConfig.paddingCharType = 'SEPARATOR';
        newConfig.paddingCharacter = config.separator_character;
        break;
      case 'FIXED':
        if (is.undefined(config.padding_character) ||
          config.padding_character.length > 1) {
          throw new Error(
            // eslint-disable-next-line max-len
            `Multiple or unknown padding character(s) ($config.padding_character)`,
          );
        }
        newConfig.paddingCharType = 'FIXED';
        newConfig.paddingCharacter = config.padding_character;
        break;
      default:
        throw new Error(
          `Unknown padding character type (${config.padding_character_type})`);
      }
    }
    newConfig.paddingAlphabet = this.__getPaddingAlphabet(config);
    log.trace(`returning newConfig: ${JSON.stringify(newConfig)}`);
    return newConfig;
  }
}

export {Presets};
