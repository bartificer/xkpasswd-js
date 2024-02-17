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
   * @private xkpasswd - reference to the XKPasswd library
   */
  #xkpasswd;

  /**
   * @constructor
   *
   * @param {PresetModel} model - new PresetModel
   * @param {PresetView} view - new PresetView
   */
  constructor(model, view) {
    this.#model = model;
    this.#view = view;

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
    // XKP.__updateSettings();
  };
}

export {PresetController};
