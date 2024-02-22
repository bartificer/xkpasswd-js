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
      // don't do anything
      break;
    default:
      // separator_character contains a character
      renderConfig.separator_type_char =
              renderConfig.separator_character;
      renderConfig.separator_character = 'CHAR';
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
      renderConfig.padding_char_type_char =
                    renderConfig.padding_character;
      renderConfig.padding_char_type = 'CHAR';
      break;
    }
    return renderConfig;
  }
};

export {SettingsController};
