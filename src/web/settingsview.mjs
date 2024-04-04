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
    this.__togglePaddingCharType('FIXED');
    this.__toggleSeparatorType('NONE');

    $('#invalidSettings').hide();

    $('#padding_type').on('change', (e) => {
      this.__togglePaddingType(e);
    });
    $('#padding_character_type').on('change', (e) => {
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
   * @param {object} preset - settings belonging by the current preset
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
    this.__togglePaddingCharType(preset.padding_character_type);
  };

  /**
   * Bind the form to the event handler.
   *
   * A change in any field of the form will trigger the form
   * validation. If the field input is not valid, an error message will be shown
   * and the Generate button will be disabled.
   * If the field input is valid the modified settings will be saved and the
   * Generate button will be enabled.
   *
   * Save the modified settings to generate passwords
   * based on these new settings
   *
   * @param {Function} handle - pass control to the Controller
   */
  bindSaveSettings(handle) {
    /*
     * Set an event handler on a change in any field and if the input is
     * valid, process and save the settings.
     * This removes the need for a 'save' button.
     */

    $('form#passwordSettings').on('keyup change', (e) => {
      const form = e.target.form;
      e.preventDefault();
      e.stopPropagation();

      log.trace('starting validity checks.');

      // remove the green marks
      form.classList.remove('was-validated');

      $('#invalidSettings').hide();
      // check if the form is valid and if not, show the error message
      if (!form.reportValidity()) {
        // the form is not valid
        form.classList.add('was-validated');
        $('#invalidSettings').show();

        // True MVC requires this to be handled by the PasswordView,
        // but since it's only one line, we don't bother
        $('#generate').prop('disabled', true);

      } else {
        // get the form data and pass it on to the controller handle function
        const formData = new FormData(form);
        const data = {};
        [...formData.keys()].forEach((key) => {
          const values = formData.getAll(key);
          data[key] = (values.length > 1) ? values : values.join();
        });

        // True MVC requires this to be handled by the PasswordView,
        // but since it's only one line, we don't bother
        $('#generate').prop('disabled', false);

        log.trace(JSON.stringify(data));
        handle(data);
      }
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

    // always remove it, just add it only in case of 'RANDOM'
    $('#separator_alphabet').prop('required', false);
    // always remove it, just add it only in case of 'FIXED'
    $('#separator_character').prop('required', false);

    switch (separatorType) {
    case 'NONE':
      $('label[for="separator_character"]').hide(this.#aniTime);
      $('#separator_character').hide(this.#aniTime);
      $('label[for="separator_alphabet"]').hide(this.#aniTime);
      $('#separator_alphabet').hide(this.#aniTime);
      break;

    case 'FIXED':
      $('label[for="separator_character"]').show(this.#aniTime);
      $('#separator_character').show(this.#aniTime);
      $('label[for="separator_alphabet"]').hide(this.#aniTime);
      $('#separator_alphabet').hide(this.#aniTime);
      $('#separator_character').prop('required', true);
      break;

    case 'RANDOM':
      $('label[for="separator_character"]').hide(this.#aniTime);
      $('#separator_character').hide(this.#aniTime);
      $('label[for="separator_alphabet"]').show(this.#aniTime);
      $('#separator_alphabet').show(this.#aniTime);
      $('#separator_alphabet').prop('required', true);
      break;

    default:
      // eslint-disable-next-line max-len
      log.warn(`WARNING - Received invalid separator_type (${separatorType})`);
      break;
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
    const paddingType = (typeof e == 'string') ? e : $(e.target).val();
    log.trace(`__toggleCharPaddingType: ${paddingType}`);

    const paddingCharBefore = $('#padding_characters_before').parent().parent();
    const paddingCharAfter = $('#padding_characters_after').parent().parent();
    const padToLength = $('#pad_to_length').parent().parent();

    switch (paddingType) {
    case 'NONE':
      paddingCharBefore.hide(this.#aniTime);
      paddingCharAfter.hide(this.#aniTime);
      padToLength.hide(this.#aniTime);
      $('div#padding_char_container').hide(this.#aniTime);
      break;

    case 'FIXED':
      paddingCharBefore.show(this.#aniTime);
      paddingCharAfter.show(this.#aniTime);
      padToLength.hide(this.#aniTime);
      $('div#padding_char_container').show(this.#aniTime);
      break;

    case 'ADAPTIVE':
      paddingCharBefore.hide(this.#aniTime);
      paddingCharAfter.hide(this.#aniTime);
      padToLength.show(this.#aniTime);
      $('div#padding_char_container').show(this.#aniTime);
      break;

    default:
      try {
        log.warn(`WARNING - Received invalid padding_type=${paddingType}`);
      } catch (e) {};
      break;
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
    const paddingType = (typeof e == 'string') ? e : $(e.target).val();
    log.trace(`__togglePaddingCharType: ${paddingType}`);

    // we need to hide the entire section, including the `input-group` and it's
    // parent div otherwise the pad_to_length will not float next to the
    // padding type element
    const paddingCharacter = $('#padding_character').parent().parent();
    const paddingAlphabet = $('#padding_alphabet').parent().parent();

    // always remove it, just add it only in case of 'RANDOM'
    $('#padding_alphabet').prop('required', false);
    // always remove it, just add it only in case of 'FIXED'
    $('#padding_character').prop('required', false);

    switch (paddingType) {
    case 'NONE':
      paddingCharacter.hide(this.#aniTime);
      paddingAlphabet.hide(this.#aniTime);
      $('#padding_character').prop('required', false);
      break;

    case 'FIXED':
      paddingCharacter.show(this.#aniTime);
      paddingAlphabet.hide(this.#aniTime);
      $('#padding_character').prop('required', true);
      break;

    case 'RANDOM':
      paddingCharacter.hide(this.#aniTime);
      paddingAlphabet.show(this.#aniTime);
      $('#padding_alphabet').prop('required', true);
      break;

    case 'SEPARATOR':
      // only allow this option be selected
      // when there is a separator character,
      // if not, switch to single separator char
      if ($('#separator_type').val() == 'NONE') {
        $('#padding_character_type').val('FIXED');
        return;
      }
      // if it is OK to select this option, update the UI appropriately
      paddingCharacter.hide(this.#aniTime);
      paddingAlphabet.hide(this.#aniTime);
      break;
    default:
      log.log(`WARNING - Received invalid padding_type=${paddingType}`);
      break;
    };
  };
};

export {SettingsView};
