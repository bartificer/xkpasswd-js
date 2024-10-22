/**
 * @module web/PresetView
 */
import log from 'loglevel';

/**
 * @class This class handles the rendering of
 * and interaction with the preset buttons.
 *
 * @constructor
 */
class PresetView {
  /**
   * presetGroup - reference to the HTML preset group
   */
  #presetGroup;
  /**
   * presetHeader - reference to the HTML preset header
   */
  #presetHeader;

  /**
   * presetDescription - reference to the HTML div that will contain
   * the description of the current preset
   */
  #presetDescription;

  /**
   * Constructor
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
   * event handler
   *
   * @param {Array} names - list of preset names
   * @param {function} handler - handle the change in the Controller
   */
  buildPresetButtons(names, handler) {
    // build the buttons
    names.forEach((presetName) => {
      const btn =
        `<button type="button"
        ${ presetName === "CUSTOM" ? 'style="display:none"' : "" }
        class="btn btn-outline-primary col-sm-6 col-md-4 col-lg-2"
        data-preset="${presetName}">${presetName}</button>`;

      // add the event handlers
      const button = $(btn);
      this.__bindSelectPreset(button, handler);
      this.#presetGroup.append(button);
    });
  };

  /**
   * This function shows the description of the currently selected preset.
   * Depending on the occurrence of the word WARNING the box is displayed in
   * red or blue.
   *
   * @param {string} description - the description of the preset
   */
  displayDescription(description) {
    const WARNING = 'border-danger bg-danger-subtle';
    const NORMAL  = 'border-primary-subtle bg-primary-subtle';
    if (description.includes('WARNING')) {
      this.#presetDescription
        .addClass(WARNING).removeClass(NORMAL);
    } else {
      this.#presetDescription
        .removeClass(WARNING).addClass(NORMAL);
    }
    this.#presetDescription.html(description).show();
  }

  /**
   * Update the title in the preset view
   *
   * @param {string} preset - the selected preset
   */
  setTitle(preset) {
    this.__setPresetHeader(preset);
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
}

export {PresetView};
