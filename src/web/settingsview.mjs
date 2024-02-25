import log from 'loglevel';

/**
 * This class handles the rendering of
 * and interaction with the settings
 *
 * @class SettingsView
 */
class SettingsView {
  /**
   * @private {number} aniTime - set time to show/hide elements
   */
  #aniTime = 250;

  /**
   * @constructor
   */
  constructor() {
    this.__togglePaddingType('NONE');
    this.__togglePaddingCharType('CHAR');
    this.__toggleSeparatorType('NONE');

    $('#padding_type').on('change', (e) => {
      this.__togglePaddingType(e);
    });
    $('#padding_char_type').on('change', (e) => {
      this.__togglePaddingCharType(e);
    });
    $('#separator_type').on('change', (e) => {
      this.__toggleSeparatorType(e);
    });
  };

  /**
   * Update the fields in the settings with
   * the contents of the current preset
   *
   * @param {object} preset - settings beloning by the current preset
   */
  renderSettings(preset) {
    // get the current preset
    const keys = Object.keys(preset);

    // update all fields
    keys.forEach((key) => {
      $(`#${key}`).val(preset[key]);
    });

    // hide everything that should not be visible
    this.__toggleSeparatorType(preset.separator_type);
    this.__togglePaddingType(preset.padding_type);
    this.__togglePaddingCharType(preset.padding_char_type);
  };

    /**
   * Bind the form to the event handler
   *
   * Save the modified settings to generate passwords
   * based on these new settings
   *
   * @param {Function} handle - pass control to the Controller
   */
  bindSaveSettings(handle) {

    $('form#passwordSettings').on('submit', (e) => {
      e.preventDefault();
      e.stopPropagation(); // stop the event bubbling

      const formData = new FormData(e.target);
      const data = {};
      [...formData.keys()].forEach((key) => {
        log.trace(`formData.key = ${key}`);
        const values = formData.getAll(key);
        data[key] = (values.length > 1) ? values : values.join();
      });
      log.trace(JSON.stringify(data));
      handle(data);
    });
  }


  /**
     * Toggle visibility of separator type related
     * elements
     *
     * @private
     *
     * @param {Event | string } e - either the
     * event or the type value
     */
  __toggleSeparatorType = (e) => {
    const separatorType = (typeof e == 'string') ? e : $(e.target).val();
    log.trace(`__toggleCharSeparatorType: ${separatorType}`);
    switch (separatorType) {
    case 'NONE':
      $('label[for="separator_type_char"]').hide(this.#aniTime);
      $('#separator_type_char').hide(this.#aniTime);
      $('label[for="separator_alphabet"]').hide(this.#aniTime);
      $('#separator_alphabet').hide(this.#aniTime);
      break;

    case 'CHAR':
      $('label[for="separator_type_char"]').show(this.#aniTime);
      $('#separator_type_char').show(this.#aniTime);
      $('label[for="separator_alphabet"]').hide(this.#aniTime);
      $('#separator_alphabet').hide(this.#aniTime);
      break;

    case 'RANDOM':
      $('label[for="separator_type_char"]').hide(this.#aniTime);
      $('#separator_type_char').hide(this.#aniTime);
      $('label[for="separator_alphabet"]').show(this.#aniTime);
      $('#separator_alphabet').show(this.#aniTime);
      break;

    default:
      try {
        log.warn(`WARNING - Received invalid separator_character=
        ${separatorType}`);
      } catch (e) {};
      break;
    }
    if (typeof e != 'string') {
      e.stopPropagation();
    }
  };

  /**
     * Toggle visibility of padding type related
     * elements
     *
     * @private
     *
     * @param {Event | string } e - either the
     * event or the type value
     */
  __togglePaddingType = (e) => {
    const paddingType = (typeof e == 'string') ? e : $(e.currentTarget).val();
    log.trace(`__toggleCharPaddingType: ${paddingType}`);
    switch (paddingType) {
    case 'NONE':
      $('label[for="padding_characters_before"]').hide(this.#aniTime);
      $('#padding_characters_before').hide(this.#aniTime);
      $('label[for="padding_characters_after"]').hide(this.#aniTime);
      $('#padding_characters_after').hide(this.#aniTime);
      $('label[for="pad_to_length"]').hide(this.#aniTime);
      $('#pad_to_length').hide(this.#aniTime);
      $('div#padding_char_container').hide(this.#aniTime);
      break;

    case 'FIXED':
      $('label[for="padding_characters_before"]').show(this.#aniTime);
      $('#padding_characters_before').show(this.#aniTime);
      $('label[for="padding_characters_after"]').show(this.#aniTime);
      $('#padding_characters_after').show(this.#aniTime);
      $('label[for="pad_to_length"]').hide(this.#aniTime);
      $('#pad_to_length').hide(this.#aniTime);
      $('div#padding_char_container').show(this.#aniTime);
      break;

    case 'ADAPTIVE':
      $('label[for="padding_characters_before"]').hide(this.#aniTime);
      $('#padding_characters_before').hide(this.#aniTime);
      $('label[for="padding_characters_after"]').hide(this.#aniTime);
      $('#padding_characters_after').hide(this.#aniTime);
      $('label[for="pad_to_length"]').show(this.#aniTime);
      $('#pad_to_length').show(this.#aniTime);
      $('div#padding_char_container').show(this.#aniTime);
      break;

    default:
      try {
        log.warn(`WARNING - Received invalid padding_type=${paddingType}`);
      } catch (e) {};
      break;
    }
    if (typeof e != 'string') {
      e.stopPropagation();
    }
  };

  /**
     * Toggle visibility of padding type related
     * elements
     *
     * @private
     *
     * @param {Event | string } e - either the
     * event or the type value
     */
  __togglePaddingCharType = (e) => {
    const paddingType = (typeof e == 'string') ? e : $(e.currentTarget).val();
    if (typeof e != 'string') {
      e.stopPropagation();
    }
    log.trace(`__togglePaddingCharType: ${paddingType}`);

    switch (paddingType) {
    case 'CHAR':
      $('label[for="padding_char_type_char"]').show(this.#aniTime);
      $('#padding_char_type_char').show(this.#aniTime);
      $('label[for="padding_char_type_random"]').hide(this.#aniTime);
      $('#padding_char_type_random').hide(this.#aniTime);
      break;

    case 'RANDOM':
      $('label[for="padding_char_type_char"]').hide(this.#aniTime);
      $('#padding_char_type_char').hide(this.#aniTime);
      $('label[for="padding_char_type_random"]').show(this.#aniTime);
      $('#padding_char_type_random').show(this.#aniTime);
      break;

    case 'SEPARATOR':
      // only allow this option be selected
      // when there is a separator character,
      // if not, switch to single separator char
      if ($('#separator_type').val() == 'NONE') {
        $('#padding_char_type').val('CHAR');
        return;
      }
      // if it is OK to select this option, update the UI appropriately
      $('label[for="padding_char_type_char"]').hide(this.#aniTime);
      $('#padding_char_type_char').hide(this.#aniTime);
      $('label[for="padding_char_type_random"]').hide(this.#aniTime);
      $('#padding_char_type_random').hide(this.#aniTime);
      break;
    default:
      try {
        log.log(`WARNING - Received invalid padding_type=${paddingType}`);
      } catch (e) {};
      break;
    };
  };
};

export {SettingsView};
