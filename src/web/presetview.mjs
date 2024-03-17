import log from 'loglevel';

/**
 * This class handles the rendering of
 * and interaction with the preset buttons
 *
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
   * @private presetDescription - reference to the HTML div that will contain
   * the description of the current preset
   */
  #presetDescription;

  /**
   * @constructor
   */
  constructor() {
    this.#presetGroup = $('#preset-btn-group');
    this.#presetHeader = $('#currentPreset');
    this.#presetDescription = $('#presetDescription');

    this.#presetDescription.hide();
    log.trace('PresetView constructor executed');
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
      const btn = `<button type="button" class="btn btn-outline-primary col-sm-6 col-md-4 col-lg-2"
      data-preset="${presetName}">${presetName}</button>`;
      /* eslint-enable max-len */

      // add the eventhandlers
      const button = $(btn);
      this.__bindSelectPreset(button, handler);
      this.#presetGroup.append(button);
    });
  };

  /**
   * This function shows the description of the currently selected preset
   *
   * @param {string} description - the description of the preset
   */
  displayDescription(description) {
    this.#presetDescription.html(description).show();
  }

  /**
   * This is the function that is called
   * when one of the preset buttons is clicked
   *
   * @private
   *
   * @param {Object} btn - preset button
   * @param {function} handle - pass control to the Controller
   */
  __bindSelectPreset(btn, handle) {
    log.trace(`bindSelectPreset for ${btn}`);
    $(btn).on('click', (e) => {
      e.stopPropagation();
      const button = $(e.currentTarget);
      const preset = button.data('preset').toString();

      // make all buttons inactive
      this.#presetGroup.find('button').removeClass('active');

      // make the selected button active
      button.addClass('active');

      // update the preset header
      this.__setPresetHeader(preset);

      // pass control to the Controller
      handle(preset);

      log.trace(`Preset clicked ${JSON.stringify(preset)}`);
    });
  };

  /**
   * Set the selected preset in the header
   *
   * @private
   *
   * @param {string} preset - the selected preset
   */
  __setPresetHeader(preset) {
    this.#presetHeader.html(`&mdash; ${preset}`);
  };
};

export {PresetView};
