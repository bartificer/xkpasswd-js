import { Presets } from "../lib/presets.mjs";

/**
 * Return the string truncated to the desired length
 *
 * @param {number} length - The length that the string will be truncated to
 * @param {string} suffix - The suffix to append at the end of the truncated string
 * @returns {string} - The truncated string
 */
String.prototype.truncate = function (length=50, suffix="(...)") {
  return `${this.substring(0,length-suffix.length)}${suffix}`;
};

const map = [
  "dict",
  "num_words",
  "word_length_min",
  "word_length_max",

  "case_transform",

  "separator_type",
  "separator_character",
  "separator_alphabet",

  "padding_digits_before",
  "padding_digits_after",
  "padding_type",
  "pad_to_length",
  "padding_character_type",
  "padding_character",
  "padding_alphabet",
  "padding_characters_before",
  "padding_characters_after"
];

/**
 * This class handle the loading/saving of custom password configurations
 *
 */
class Config {
  /**
   * @private __settings - Object with the loaded settings
   */
  __settings;

  /**
   * The default class constructor
   *
   * @param {Object} settings - Object with the current settings, this can be undefined
   */
  constructor(settings) {
    if (typeof settings !== 'undefined') {
      this.__settings = settings;
    }
  }

  /**
   * Retun true if settings have been loaded
   *
   * @returns {boolean} - true if settings have been loaded, false otherwise
   */
  isLoaded() {
    if ( typeof this.__settings === "undefined" ) {
      return false;
    }
    return true;
  }

  /**
   * Return the settings object
   *
   * @returns {object} - the current settings
   */
  getSettings() {
    return this.__settings;
  }

  /**
   * Loads the settings from a URL and stores them in a private object
   * Return true if successfull or false otherwise
   *
   * @param {string} url - The URL to try to extract the settings
   * @returns {boolean} - true if the settings were loaded from the URL, or false otherwise
   */
  loadFromUrl(url) {
    const params = new URL(url).searchParams;
    const settings = new Object();
    let values = null;

    if (params.get("c") == null) { return null; }

    values = this.__base64URLdecode(params.get("c")).join("").split(",");

    map.forEach(element => {
      if (
        element == 'separator_character' || element == 'separator_alphabet' ||
        element == 'padding_character' || element == 'padding_alphabet'
      ) {
        settings[element] = this.__base64URLdecode(values.shift());
        settings[element] = settings[element].join("")
      } else {
        settings[element] = values.shift();
        settings[element] = (parseInt(settings[element])) ? parseInt(settings[element]) : settings[element];
      }
    });

    this.__settings = settings;
    return true;
  }

  /**
   * Return a URL string with the encoded settings string
   *
   * @param {string} url - The URL to add or update with the settings. Defaults to the current browser URL
   * @returns {string} - The URL as string
   */
  toUrl(url) {
    const encodedSettings = this.__getEncodedSettings();

    if (typeof url === 'undefined') {
      url = new URL(window.location);
    }

    url.searchParams.set("c", encodedSettings);

    return url.toString();
  }

  /**
   * Converts the settings object to a CSV array and returns it as a
   * URL safe base64 encoded string
   *
   * @returns {string} - A base64 encoded string with the settings
   */
  __getEncodedSettings() {
    let values = [];

    map.forEach(element => {
      if (
        element == 'separator_character' || element == 'separator_alphabet' ||
        element == 'padding_character' || element == 'padding_alphabet'
      )
      {
        values.push(this.__base64URLencode(this.__settings[element]));
      } else {
        values.push(this.__settings[element]);
      }
    });

    return this.__base64URLencode(values.join(","));
  }

  /**
   * Retrun the string as a URL safe base64 encoded string
   *
   * @param {string} str - string to encode as base64 string
   * @returns {string} - A base64 encoded string
   */
  __base64URLencode(str) {
    const base64Encoded = btoa(str);
    return base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  /**
   * Return the string decoded from a URL safe base64 encoded string
   *
   * @param {string} str - A base64 encoded string
   * @returns {string} - The decoded string
   */
  __base64URLdecode(str) {
    const base64Encoded = str.replace(/-/g, '+').replace(/_/g, '/');
    const padding = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
    const base64WithPadding = base64Encoded + padding;
    return atob(base64WithPadding)
      .split('')
      .map(char => String.fromCharCode(char.charCodeAt(0)));
  }
}

export {Config};
