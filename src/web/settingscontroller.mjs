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

    log.debug('SettingsController constructor executed');
  }

  /**
   * Update the settings
   * @param {Object} config
   *
   */
  updateSettings(config) {
    this.#view.renderSettings(config);
  }
}

export {SettingsController};
