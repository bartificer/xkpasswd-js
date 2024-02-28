import log from 'loglevel';

/**
 * @class SettingsController
 */
class SettingsController {
  /**
   * @private model - reference to settings model
   */
  #model;

  /**
   * @private view - reference to SettingsView
   */
  #view;

  /**
   * @constructor
   *
   * @param {SettingsModel} model - new SettingsModel
   * @param {SettingsView} view - new SettingsView
   */
  constructor(model, view) {
    this.#model = model;
    this.#view = view;

    this.#view.bindSaveSettings(this.saveSettings);
    log.trace('SettingsController constructor executed');
  }

  /**
   * Update the settings
   * @param {Object} config - the configuration
   *
   */
  updateSettings(config) {
    const renderConfig = this.__prepareForRendering(config);

    this.#view.renderSettings(renderConfig);
  }

  /**
   * Convert the rendered settings back to the model and pass it on
   * to the XKpasswd class to use for password generation
   *
   * @param {Object} settings - the object containing the new settings
   */
  saveSettings = (settings) => {
    log.trace(`controller saveSettings: ${JSON.stringify(settings)}`);

    // fix the separator character
    switch (settings.separator_type) {
    case 'RANDOM':
    case 'NONE':
      settings.separator_character = settings.separator_type;
      break;
    case 'CHAR':
      settings.separator_character = settings.separator_type_char;
      break;
    };

    // fix the padding character
    switch (settings.padding_char_type) {
    case 'SEPARATOR':
    case 'RANDOM':
      settings.padding_character = settings.padding_char_type;
      break;
    case 'CHAR':
      settings.padding_character = settings.padding_char_type_char;
    };

    // convert characters back to numbers
    settings.sep_before_before = parseInt(settings.sep_before_before);
    settings.sep_before_after = parseInt(settings.sep_before_after);
    settings.padding_digits_before = parseInt(settings.padding_digits_before);
    settings.padding_digits_after = parseInt(settings.padding_digits_after);
    settings.padding_characters_before = parseInt(settings.padding_characters_before);
    settings.padding_characters_after = parseInt(settings.padding_characters_after);
    settings.pad_to_length = parseInt(settings.pad_to_length);

    this.#model.setPreset({
      description: 'Custom preset',
      config: settings
    });
  }

  /**
   * Prepare the config object as retrieved from XKPasswd library
   * to match the fields in the settings part of the webapp
   *
   * @private
   *
   * @param {Object} config - the config object as retrieved
   * @return {Object} - the updated object that matches the input fields
   */
  __prepareForRendering(config) {
    const renderConfig = config;
    // split the separator_character into a proper type and char
    switch (renderConfig.separator_character) {
    case 'RANDOM':
    case 'NONE':
      renderConfig.separator_type =
              renderConfig.separator_character;
      break;
    default:
      // separator_character contains a character
      renderConfig.separator_type = 'CHAR';
      renderConfig.separator_type_char = renderConfig.separator_character;
      break;
    }

    // split the padding_character into a proper type and char
    switch (renderConfig.padding_character) {
    case 'RANDOM':
      renderConfig.padding_char_type = 'RANDOM';
      renderConfig.padding_char_type_random = config.padding_alphabet;
      break;
    case 'SEPARATOR':
      renderConfig.padding_char_type = 'CHAR';
      renderConfig.padding_char_type_char = renderConfig.separator_character;
      break;
    default:
      // padding_character contains a character
      renderConfig.padding_char_type = 'CHAR';
      renderConfig.padding_char_type_char =
                    renderConfig.padding_character;
      break;
    }
    return renderConfig;
  }
};

export {SettingsController};
