import log from 'loglevel';

/**
 * @class PresetView
 */
class PresetView {
  /**
   * @private presetGroup - reference to the HTML preset group
   */
  #presetGroup;
  /**
   * @private presetHeader - reference to the HTML preset header
   */
  #presetHeader;

  /**
   * @constructor
   */
  constructor() {
    this.#presetGroup = $('#preset-btn-group');
    this.#presetHeader = $('#currentPreset');

    log.debug('PresetView constructor executed');
  }

  /**
   * This is the function that is called
   * when one of the preset buttons is clicked
   *
   * @param {Object} btn - preset button
   * @param {function} handle - pass control to the Controller
   */
  bindSelectPreset(btn, handle) {
    log.debug(`bindSelectPreset for ${btn}`);
    $(btn).on('click', (e) => {
      e.stopPropagation();
      const button = $(e.currentTarget);
      const preset = button.data('preset').toString();

      // make all buttons inactive
      this.#presetGroup.find('button').removeClass('active');

      // make the selected button active
      button.addClass('active');

      // update the preset header
      this.setPresetHeader(preset);

      // pass control to the Controller
      handle(preset);

      log.debug(`Preset clicked ${JSON.stringify(preset)}`);
    });
  };

  /**
   * Set the selected preset in the header
   *
   * @param {string} preset - the selected preset
   */
  setPresetHeader(preset) {
    this.#presetHeader.html(`&mdash; ${preset}`);
  };

  /**
   * Build the preset buttons and add the
   * eventhandler
   *
   * @param {Array} names - list of preset names
   * @param {function} handler - handle the change in the Controller
   */
  buildPresetButtons(names, handler) {
    // build the buttons
    names.forEach((presetName) => {
      /* eslint-disable max-len */
      const btn = `<button type="button" class="btn btn-outline-primary"
      data-preset="${presetName}">${presetName}</button>`;
      /* eslint-enable max-len */

      // add the eventhandlers
      const button = $(btn);
      this.bindSelectPreset(button, handler);
      this.#presetGroup.append(button);
    });
  };
}

export {PresetView};
