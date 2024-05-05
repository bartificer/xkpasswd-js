import log from 'loglevel';
import {Collapse} from 'bootstrap';

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

      this.setErrorMessage('');
      // check if the form is valid and if not, show the error message
      if (!form.reportValidity()) {
        // the form is not valid
        form.classList.add('was-validated');
        this.setErrorMessage('Please fix the invalid input before generating passwords.');
        this.disableGenerateButton(true);
      }
      else {
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
   * Bind the load config form
   *
   * @param {Function} handle - pass control to the Controller
   */
  bindLoadConfig(handle) {
    $('form#uploadConfigFile').on('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.target.elements[0].files;

      // If there's no file, do nothing
      if (!files.length) return;

      // Create a new FileReader() object
      const reader = new FileReader();
      this.showSettings();
      this.setErrorMessage("");
      this.disableGenerateButton(false);
      $('#passwordSettings').show();


      // Set up the callback event to run when the file is read
      reader.onload = (event) => {
        const json = JSON.parse(event.target.result);
        log.trace(`json: ${JSON.stringify(json)}`);
        handle(json);
      };

      // Read the file
      reader.readAsText(files[0]);
    });
  }

  /**
   * Open the accordion to show the settings
   */
  showSettings() {
    // make sure the settings section is not collapsed
    Collapse.getOrCreateInstance('#collapseConfig', {
      toggle: false,
    }).show();
    Collapse.getOrCreateInstance('#collapseSettings', {
      toggle: false,
    }).show();
  }

  /**
   * disable the Generate button to avoid errors in password generation
   * @param {boolean} state - if true then disable the button
   */
  disableGenerateButton(state) {
    // True MVC requires this to be handled by the PasswordView,
    // but since it's only one line, we don't bother
    $('#generate').prop('disabled', (state));
  }

  /**
   * Set the error message and show it
   * or hide it on empty message
   * @param {string }t - text or empty
   */
  setErrorMessage(t) {
    if (t && t.length > 0) {
      $('#invalidSettings').text(t).show();
    }
    else {
      $('#invalidSettings').text("").hide();
    }

  }

  /**
   * Render the error caused by the uploaded configuration
   * Hide the fields because they cannot be updated
   * Disable the Generate button because behaviour is unpredictable
   */
  renderConfigError(e) {
    this.showSettings();
    this.disableGenerateButton(true);
    $('#passwordSettings').hide();
    this.setErrorMessage(e.message);
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
    const separatorCharacter = $('#separator_character');
    separatorCharacter.prop('required', false);
    // always remove it, just add it only in case of 'FIXED'
    const separatorAlphabet = $('#separator_alphabet');
    separatorAlphabet.prop('required', false);

    const separatorCharacterParent = separatorCharacter.parent();
    const separatorAlphabetParent = separatorAlphabet.parent();

    switch(separatorType) {
    case 'NONE':
      separatorCharacterParent.hide(this.#aniTime);
      separatorAlphabetParent.hide(this.#aniTime);
      break;

    case 'FIXED':
      separatorCharacterParent.show(this.#aniTime);
      separatorAlphabetParent.hide(this.#aniTime);
      separatorCharacter.prop('required', true);
      break;

    case 'RANDOM':
      separatorCharacterParent.hide(this.#aniTime);
      separatorAlphabetParent.show(this.#aniTime);
      separatorAlphabet.prop('required', true);
      break;

    default:
      const msg = `WARNING - Received invalid separator_type (${separatorType})`;
      log.warn(msg);
      throw (new Error(e));
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
    const paddingCharContainer = $('div#padding_char_container');

    switch(paddingType) {
    case 'NONE':
      paddingCharBefore.hide(this.#aniTime);
      paddingCharAfter.hide(this.#aniTime);
      padToLength.hide(this.#aniTime);
      paddingCharContainer.hide(this.#aniTime);
      break;

    case 'FIXED':
      paddingCharBefore.show(this.#aniTime);
      paddingCharAfter.show(this.#aniTime);
      padToLength.hide(this.#aniTime);
      paddingCharContainer.show(this.#aniTime);
      break;

    case 'ADAPTIVE':
      paddingCharBefore.hide(this.#aniTime);
      paddingCharAfter.hide(this.#aniTime);
      padToLength.show(this.#aniTime);
      paddingCharContainer.show(this.#aniTime);
      break;

    default:
      const msg = `WARNING - Received invalid padding_type=${paddingType}`;
      log.warn(msg);
      throw (new Error(msg));
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
    const paddingCharacter = $('#padding_character');
    const paddingAlphabet = $('#padding_alphabet');
    const paddingCharacterParent = paddingCharacter.parent().parent();
    const paddingAlphabetParent = paddingAlphabet.parent().parent();

    // always remove it, just add it only in case of 'RANDOM'
    paddingAlphabet.prop('required', false);
    // always remove it, just add it only in case of 'FIXED'
    paddingCharacter.prop('required', false);

    // hide everything so we only show what's needed
    paddingCharacterParent.hide(this.#aniTime);
    paddingAlphabetParent.hide(this.#aniTime);

    switch(paddingType) {
    case 'NONE':
      // nothing more to do here
      break;

    case 'FIXED':
      paddingCharacterParent.show(this.#aniTime);
      paddingCharacter.prop('required', true);
      break;

    case 'RANDOM':
      paddingAlphabetParent.show(this.#aniTime);
      paddingAlphabet.prop('required', true);
      break;

    case 'SEPARATOR':
      // only allow this option be selected
      // when there is a separator character,
      // if not, switch to single separator char
      if ($('#separator_type').val() === 'NONE') {
        $('#padding_character_type').val('FIXED');
        return;
      }
      break;
    default:
      const msg = `WARNING - Received invalid padding_char_type=${paddingType}`;
      log.warn(msg);
      throw (new Error(msg));
    }
  };
}

export {SettingsView};
