import log from 'loglevel';

const map = [
  'dict',
  'num_words',
  'word_length_min',
  'word_length_max',

  'case_transform',

  'separator_type',
  'separator_character',
  'separator_alphabet',

  'padding_digits_before',
  'padding_digits_after',
  'padding_type',
  'pad_to_length',
  'padding_character_type',
  'padding_character',
  'padding_alphabet',
  'padding_characters_before',
  'padding_characters_after',
];

/**
 * This class handle the loading/saving of custom password configurations
 *
 * There are 2 ways of loading/saving:
 *
 * - the origin of this class: using a base64encoded uri
 * - importing and exporting a JSON file
 *
 */
class ConfigController {
  /**
   * @private model - reference to password model
   */
  #model;

  /**
   * @private view - reference to ConfigView
   */
  #view;

  /**
   * @private settingsController - reference to SettingsController
   */
  #settingsController;

  /**
   * The default class constructor
   * @constructor
   *
   * @param {XKPasswd} model - reference to PasswordModel
   * @param {ConfigView} view - reference to ConfigView
   * @param {SettingsController} settingsController - reference to
   *   SettingsController
   */
  constructor(model, view, settingsController) {
    this.#model = model;
    this.#view = view;
    this.#settingsController = settingsController;

    this.#view.bindLoadConfig(this.importSettings);
    this.#view.bindSaveConfig(this.exportSettings);
    this.#view.bindCopySettingsLink(this.copyUrl);
  }

  /**
   *  Import the settings from the uploaded file
   *
   * @param {Object} settings - the object containing the uploaded settings
   */
  importSettings = (settings) => {
    this.#model.setCustomPreset(settings);

    try {
      // yes, config should be the same as settings, but there is some
      // conversion going on in the preset class, so we use the one that is
      // actually stored.

      const config = this.#model.getPreset().config();
      this.#settingsController.updateSettings(config);
      const url = this.toUrl(config);
      this.#view.updateLink(url);
    }
    catch (e) {
      this.#view.renderConfigError(e);
    }
  };

  /**
   * Convert the settings to a JSON object
   *
   * @return {string} - the JSON version of the settings
   */
  exportSettings = () => {
    const settings = this.#model.getPreset().config();
    const jsonBlob = new Blob([JSON.stringify(settings)],
      {type: 'application/json'});

    return URL.createObjectURL(jsonBlob);
  };

  /**
   * Update the settingsLink content
   * @param settings
   */
  updateLink(settings) {
    const url = this.toUrl(settings);
    this.#view.updateLink(url);
  }

  /**
   * Copy the parameter to the clipboard
   * @param url
   */
  copyUrl(url) {
    navigator.clipboard.writeText(url);
  }


  /**
   * Loads the settings from a URL and store them in the model
   *
   * @param {string} url - The URL to try to extract the settings from
   */
  loadFromUrl(url) {
    const settings = this.fromUrl(url);

    if (JSON.stringify(settings) !== '{}') {
      // somehow I cannot get the settings object to match an empty object
      // without doing this stringify actino
      this.#model.setCustomPreset(settings);
      this.#settingsController.updateSettings(settings);
      this.#view.updateLink(window.location);
    }
  }

  /**
   * Return a URL string with the encoded settings string
   *
   * @param {Object} settings - The settings to encode
   * @returns {string} - The URL as string
   */
  toUrl(settings) {
    const encodedSettings = this.__getEncodedSettings(settings);
    const url = new URL(window.location);

    url.searchParams.set('c', encodedSettings);

    return url.toString();
  }

  /**
   * Convert an url into a settings object for further processing
   * Return an empty object if there is no parameter in the url.
   *
   * @param url - the url from the window.location or from the settingslink
   * @return {Object} - empty object if something went wrong, or settings object
   */
  fromUrl(url) {
    const params = new URL(url).searchParams;
    const settings = {};
    let values = null;

    if (params.get('c') == null) {
      return {};
    }

    values = this.__base64URLdecode(params.get('c')).split(',');

    map.forEach(element => {
      if (
        element === 'separator_character' || element === 'separator_alphabet' ||
        element === 'padding_character' || element === 'padding_alphabet'
      ) {
        settings[element] = this.__base64URLdecode(values.shift());
      }
      else {
        settings[element] = values.shift();
        settings[element] =
          (parseInt(settings[element])) ?
            parseInt(settings[element]) : settings[element];
      }
    });

    return settings;
  }

  /**
   * Converts the settings object to a CSV array and returns it as a
   * URL safe base64 encoded string
   *
   * @returns {string} - A base64 encoded string with the settings
   */
  __getEncodedSettings(settings) {
    let values = [];

    map.forEach(element => {
      if (
        element === 'separator_character' || element === 'separator_alphabet' ||
        element === 'padding_character' || element === 'padding_alphabet'
      ) {
        values.push(this.__base64URLencode(settings[element]));
      }
      else {
        values.push(settings[element]);
      }
    });

    return this.__base64URLencode(values.join(','));
  }

  /**
   * Return the string as a URL safe base64 encoded string
   *
   * @param {string} str - string to encode as base64 string
   * @returns {string} - A base64 encoded string
   */
  __base64URLencode(str) {
    const base64Encoded = btoa(str);
    return base64Encoded
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Return the string decoded from a URL safe base64 encoded string
   *
   * @param {string} str - A base64 encoded string
   * @returns {string} - The decoded string
   */
  __base64URLdecode(str) {
    const base64Encoded = str
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const padding =
      str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
    const base64WithPadding = base64Encoded + padding;
    return (atob(base64WithPadding)
      .split('')
      .map(char => String.fromCharCode(char.charCodeAt(0)))).join('');
  }
}

export {ConfigController};
