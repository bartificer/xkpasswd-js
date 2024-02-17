import log from 'loglevel';

/**
 * @class PresetController
 */
class PresetController {
  /**
   * @private model - reference to preset model
   */
  #model;

  /**
   * @private view - reference to PresetView
   */
  #view;

  /**
   * @private settings - reference to SettingsController
   */
  #settingsController;

  /**
   * @constructor
   *
   * @param {PresetModel} model - reference to PresetModel
   * @param {PresetView} view - reference to PresetView
   * @param {SettingsController} sc - reference to SettingsController
   */
  constructor(model, view, sc) {
    this.#model = model;
    this.#view = view;
    this.#settingsController = sc;

    // get the presets from the library
    const names = this.#model.getPresets();

    // initialize
    this.#view.buildPresetButtons(names, this.onPresetChanged);
    log.debug('PresetController constructor executed');
  }

  /**
   * Handle the selection of the preset
   * @param {string} preset - reference to the selected preset
   */
  onPresetChanged = (preset) => {
    // tell the library which preset to make current
    this.#model.setPreset(preset);

    // XKP.state.presetChanged = true;

    // Tell the SettingsController to update
    const config = this.#model.getPreset().config();
    this.#settingsController.updateSettings(config);
  };
}

export {PresetController};
