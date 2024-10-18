/* istanbul ignore file @preserve */
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
   * @private settingsController - reference to SettingsController
   */
  #settingsController;

  /**
   * @private passwordController - reference to PasswordController
   */
  #passwordController;
  /**
   * @constructor
   *
   * @param {XKPasswd} model - reference to PresetModel
   * @param {PresetView} view - reference to PresetView
   * @param {SettingsController} sc - reference to SettingsController
   * @param {PasswordController} pc - reference to PasswordController
   */
  constructor(model, view, sc, pc) {
    this.#model = model;
    this.#view = view;
    this.#settingsController = sc;
    this.#passwordController = pc;

    // get the presets from the library
    const names = this.#model.getPresets();

    // initialize
    this.#view.buildPresetButtons(names, this.onPresetChanged);

    log.trace('PresetController constructor executed');
  }

  /**
   * Handle the selection of the preset
   * @param {string} preset - reference to the selected preset
   */
  onPresetChanged = (preset) => {
    log.trace(`onPresetChanged: ${preset}`);

    // tell the library which preset to make current
    this.#model.setPreset(preset);

    // tell the view to update the description
    const description = this.#model.getPreset().description();
    this.#view.displayDescription(description);

    // Tell the SettingsController to update
    const config = this.#model.getPreset().config();
    this.#settingsController.updateSettings(config, preset);

    // Tell the passwordController to erase the passwords
    this.#passwordController.clearPasswords();
  };

  /**
   * Activate a preset button
   * 
   * @param {string} preset - Name of the preset
   */
  updatePresetView = (preset) => {
    log.trace(`updatePresetView: ${preset}`);

    const names = this.#model.getPresets();
    const presetName = preset.toUpperCase();

    if (names.includes(presetName)) {
      const button = $(`[data-preset='${presetName}']`);
      button.addClass('active');
    }

    const description = this.#model.getPreset().description();
    this.#view.displayDescription(description);
    this.#view.setTitle(presetName);
  };
}

export {PresetController};
