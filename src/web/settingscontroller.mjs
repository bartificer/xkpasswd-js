/* istanbul ignore file @preserve */
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
   * @param {Object} model - new SettingsModel
   * @param {SettingsView} view - new SettingsView
   */
  constructor(model, view) {
    this.#model = model;
    this.#view = view;

    this.#view.bindSaveSettings(this.saveSettings);
    this.#view.bindLoadConfig(this.importSettings);
    const config = this.#model.getPreset().config();

    this.#view.renderSettings(config);
    log.trace('SettingsController constructor executed');
  }

  /**
   * Convert the rendered settings back to the model and pass it on
   * to the XKpasswd class to use for password generation
   *
   * @param {Object} settings - the object containing the new settings
   */
  saveSettings = (settings) => {
    log.trace(`controller saveSettings: ${JSON.stringify(settings)}`);

    // convert characters back to numbers
    settings.padding_digits_before = parseInt(settings.padding_digits_before);
    settings.padding_digits_after = parseInt(settings.padding_digits_after);
    settings.padding_characters_before =
      parseInt(settings.padding_characters_before);
    settings.padding_characters_after =
      parseInt(settings.padding_characters_after);
    settings.pad_to_length = parseInt(settings.pad_to_length);

    this.#model.setPreset({
      description: 'Custom preset',
      config: settings});
  };

  /**
   * Update settings with the presets
   *
   * @param {Object} config - the configuration
   */
  updateSettings(config) {
    this.#view.renderSettings(config);
  }

  /**
   *  Import the settings from the uploaded file
   *
   * @param {Object} settings - the object containing the uploaded settings
   */
  importSettings = (settings) => {
    this.#model.setPreset({
      description: 'Custom preset',
      config: settings});

    try {
      const config = this.#model.getPreset().config();
      this.updateSettings(config);
    }
    catch (e) {
      this.#view.renderConfigError(e);
    }
  }
}

export {SettingsController};
