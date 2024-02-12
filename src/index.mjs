/**
 * @file This file only handles the update of the webapp.
 *
 * The actual password generation is done in the xkpasswd library.
 *
 * setup of this file inspired by: https://learn.jquery.com/code-organization/
 *
 */

// import bootstrap plugins
import {Tooltip} from 'bootstrap';

// import bootstrap CSS and icons
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// import webfont
import '@fontsource/noto-sans/100.css';
import '@fontsource/noto-sans/200.css';
import '@fontsource/noto-sans/400.css';
import '@fontsource/noto-sans/600.css';

import log from 'loglevel';

import './assets/site.css';
import {XKPasswd} from './lib/xkpasswd.mjs';

/**
 * Object defining all custom variables and functions
 * @namespace XKP
 *
 */
const XKP = {

  // set time to show/hide elements

  aniTime: 250,

  // set the Bootstrap classes for the various values
  stats_classes: {
    GOOD: 'btn-outline-success',
    OK: 'btn-outline-warning',
    POOR: 'btn-outline-danger',
    UNKNOWN: 'btn-danger',
  },

  /**
   * init function that sets up the variables and the initial
   * page elements.
   *
   * @function init
   * @memberof XKP
   */
  init: () => {
    // setup variables for key parts of the website
    XKP.config = {
      passwordArea: $('textarea#generated_password'),
      passwordErrorContainer: $('#passwordErrorContainer'),
      passwordStatsContainer: $('#password_stats_container'),
      passwordStrength: $('#password_strength'),
      blindEntropy: $('#entropy_blind'),
      seenEntropy: $('#entropy_seen'),
      entropySuggestion: $('#entropy_suggestion'),
      numberOfPasswords: $('#selectAmount'),
      presetGroup: $('#preset-btn-group'),
      presetHeader: $('#currentPreset'),
      xkpasswd: new XKPasswd(),
    };
    XKP.state = {
      presetChanged: true,
    };

    XKP.setup();
  },

  /**
   * Handle the password generation.
   * This is the function that is called when clicking the `Generate` button.
   *
   * @function generatePasswords
   * @memberof XKP
   * @param {event} e - event
   */

  generatePasswords: (e) => {
    e.preventDefault();

    // call generatePasswords from library

    try {
      const num = parseInt(XKP.config.numberOfPasswords.val());
      // Set passwordArea height to accomodate number of passwords
      XKP.config.passwordArea.attr('rows', num);

      const passAndStats = XKP.config.xkpasswd.generatePassword(num);

      XKP.__renderPassword(passAndStats);
    } catch (error) {
      log.error(`Password generation threw an error ${error}`);
      XKP.__renderPaswordError('ERROR password generation failed!');
    } finally {
      e.stopPropagation(); // stop the event bubbling
    }
  },

  /**
   * Select the preset
   * This is the function that is called
   * when one of the preset buttons is clicked
   *
   * @function selectPreset
   * @memberof XKP
   *
   * @param {event} e - event
   */
  selectPreset: (e) => {
    e.stopPropagation();
    const button = $(e.currentTarget);
    const preset = button.data('preset').toString();
    // make all buttons inactive
    XKP.config.presetGroup.find('button').removeClass('active');
    // make the selected button active
    button.addClass('active');
    // update the preset header
    XKP.__setPresetHeader(preset);
    // tell the library which preset to make current
    XKP.config.xkpasswd.setPreset(preset);
    log.debug(`Preset clicked ${JSON.stringify(preset)}`);
    XKP.state.presetChanged = true;
    XKP.__updateSettings();
  },

  /**
   * Update the fields in the settings with
   * the contents of the current preset
   */

  __updateSettings: () => {
    if (!XKP.state.presetChanged) {
      // nothing changed
      return;
    };

    // get the current preset
    const preset = XKP.config.xkpasswd.getPreset().config();
    const keys = Object.keys(preset);

    // update all fields
    keys.forEach((key) => {
      $(`#${key}`).val(preset[key]);
    });

    // hide everything that should not be visible
    XKP.__togglePaddingType(preset.padding_type);
    XKP.state.presetChanged = false;
  },

  /**
   * Toggle visibility of padding type related
   * elements
   *
   * @param {Event | string } e - either the
   * event or the type value
   */
  __togglePaddingType(e) {
    const paddingType = (typeof e == 'string') ? e : $(e.currentTarget).val();
    log.debug(`__toggleCharPaddingType: ${paddingType}`);
    switch (paddingType) {
    case 'NONE':
      $('label[for="padding_characters_before"]').hide(XKP.aniTime);
      $('#padding_characters_before').hide(XKP.aniTime);
      $('label[for="padding_characters_after"]').hide(XKP.aniTime);
      $('#padding_characters_after').hide(XKP.aniTime);
      $('label[for="pad_to_length"]').hide(XKP.aniTime);
      $('#pad_to_length').hide(XKP.aniTime);
      $('div#padding_char_container').hide(XKP.aniTime);
      break;

    case 'FIXED':
      $('label[for="padding_characters_before"]').show(XKP.aniTime);
      $('#padding_characters_before').show(XKP.aniTime);
      $('label[for="padding_characters_after"]').show(XKP.aniTime);
      $('#padding_characters_after').show(XKP.aniTime);
      $('label[for="pad_to_length"]').hide(XKP.aniTime);
      $('#pad_to_length').hide(XKP.aniTime);
      $('div#padding_char_container').show(XKP.aniTime);
      break;

    case 'ADAPTIVE':
      $('label[for="padding_characters_before"]').hide(XKP.aniTime);
      $('#padding_characters_before').hide(XKP.aniTime);
      $('label[for="padding_characters_after"]').hide(XKP.aniTime);
      $('#padding_characters_after').hide(XKP.aniTime);
      $('label[for="pad_to_length"]').hide(XKP.aniTime);
      $('#pad_to_length').hide(XKP.aniTime);
      $('div#padding_char_container').show(XKP.aniTime);
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
  },

  /**
   * Toggle visibility of padding type related
   * elements
   *
   * @param {Event | string } e - either the
   * event or the type value
   */
  __togglePaddingCharType(e) {
    const paddingType = (typeof e == 'string') ? e : $(e.currentTarget).val();
    log.debug(`__togglePaddingCharType: ${paddingType}`);
    switch (paddingType) {
    case 'CHAR':
      $('label[for="padding_character"]').show(XKP.aniTime);
      $('#padding_character').show(XKP.aniTime);
      $('label[for="padding_char_type_random"]').hide(XKP.aniTime);
      $('#padding_char_type_random').hide(XKP.aniTime);
      break;

    case 'RANDOM':
      $('label[for="padding_character"]').hide(XKP.aniTime);
      $('#padding_character').hide(XKP.aniTime);
      $('label[for="padding_char_type_random"]').show(XKP.aniTime);
      $('#padding_char_type_random').show(XKP.aniTime);
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
      $('label[for="padding_character"]').hide(XKP.aniTime);
      $('#padding_character').hide(XKP.aniTime);
      $('label[for="padding_char_type_random"]').hide(XKP.aniTime);
      $('#padding_char_type_random').hide(XKP.aniTime);
      break;
    default:
      try {
        log.log(`WARNING - Received invalid padding_type=${paddingType}`);
      } catch (e) {};
      break;
    };
    if (typeof e != 'string') {
      e.stopPropagation();
    }
  },

  /**
   * Show an alert with an error message
   * @param {string} msg - the error message
   */
  __renderPaswordError: (msg) => {
    // write the error message to the alert and show it

    /* eslint-disable max-len */
    const alertBox = [
      `<div class="alert alert-danger d-flex align-items-center alert-dismissible fade show" role="alert">`,
      `  <span class="text-danger"><i class="bi bi-exclamation-square-fill"></i>&nbsp;</span>`,
      `  <div id="generate_password_errors">${msg}</div>`,
      `  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
      '</div>',
    ].join('');
    /* eslint-enable max-len */

    XKP.config.passwordErrorContainer.append(alertBox);

    XKP.__hideStats();
  },

  __renderPassword: (passAndStats) => {
    // render the password(s)
    const passwds = passAndStats.passwords.join('\n');
    if (passwds) {
      XKP.config.passwordArea.val(passwds);
      log.debug(
        `texarea value changed to [${XKP.config.passwordArea.val()}]`);
    } else {
      XKP.__renderPasswordError('ERROR - server returned no passwords');
      return;
    }
    XKP.__renderDetailedStats(passAndStats.stats);
  },

  __renderDetailedStats: (stats) => {
    XKP.__renderPasswordStrength(stats);

    // Render the detailed stats

    let template = {};
    const minEntropyBlind = stats.entropy.minEntropyBlind;
    const maxEntropyBlind = stats.entropy.maxEntropyBlind;

    // first the blind entropy

    /* eslint-disable max-len */

    if (minEntropyBlind.equal) {
      // make a template for one value

      template = [
        `<span class="btn btn-stats ${XKP.__getStatsClass(minEntropyBlind.state)}"`,
        `id="entropy_min">${minEntropyBlind.value} bits</span>`,
      ].join('');
    } else {
      // make a template for two values
      template = [
        `&nbsp;between <span class="btn btn-stats ${XKP.__getStatsClass(minEntropyBlind.state)}"`,
        `id="entropy_min">${minEntropyBlind.value} bits</span> and `,
        `<span class="btn btn-stats ${XKP.__getStatsClass(maxEntropyBlind.state)}"`,
        `id="entropy_max">${maxEntropyBlind.value} bits</span>`,
      ].join('');
    }
    /* eslint-enable max-len */

    XKP.config.blindEntropy.empty().append(template);

    // seen entropy
    XKP.config.seenEntropy.html(stats.entropy.entropySeen.value + ' bits')
      .addClass(XKP.__getStatsClass(stats.entropy.entropySeen.state));

    const suggestion =
      // eslint-disable-next-line max-len
      `(suggest keeping blind entropy above ${stats.entropy.blindThreshold} bits ` +
      `and seen above ${stats.entropy.seenThreshold} bits)`;
    XKP.config.entropySuggestion.html(suggestion);

    XKP.__showStats();
  },

  __getStatsClass(state) {
    const cls = XKP.stats_classes[state];
    return cls;
  },

  __renderPasswordStrength: (stats) => {
    // we assume that the strength indicator is already calculated

    const statsText = XKP.config.xkpasswd
      .toTitleCase(stats.password.passwordStrength);
    const statsClass = XKP.__getStatsClass(stats.password.passwordStrength);

    // render strength
    XKP.config.passwordStrength.text(statsText);
    XKP.config.passwordStrength.addClass(statsClass);
  },

  /**
   * Build the preset buttons
   */
  __buildPresetButtons: () => {
    // get the presets from the library
    const names = XKP.config.xkpasswd.getPresets();
    // build the buttons
    names.forEach((presetName) => {
      /* eslint-disable max-len */
      const btn = `<button type="button" class="btn btn-outline-primary" data-preset="${presetName}">${presetName}</button>`;
      /* eslint-enable max-len */
      const button = $(btn)
        .on('click', XKP.selectPreset);
      XKP.config.presetGroup.append(button);
    });
    // add the eventhandlers
  },

  /**
   * Set the selected preset in the header
   *
   * @param {string} preset - the selected preset
   */
  __setPresetHeader: (preset) => {
    XKP.config.presetHeader.html(`&mdash; ${preset}`);
  },

  /**
   * hide statistics section
   */
  __hideStats: () => {
    XKP.config.passwordStatsContainer.addClass('d-none');
  },

  /**
   * show statistics section
   */
  __showStats: () => {
    XKP.config.passwordStatsContainer.removeClass('d-none');
  },


  /**
   * Setup the eventhandlers
   *
   * @function setup
   * @memberof XKP
   */
  setup: () => {
    XKP.config.passwordArea.val('');
    $('form#generatePasswords').on('submit', XKP.generatePasswords);
    $('#padding_type').on('change', XKP.__togglePaddingType);
    $('#padding_char_type').on('change', XKP.__togglePaddingCharType);
    XKP.__hideStats();
    XKP.__buildPresetButtons();
    XKP.__togglePaddingType('NONE');
    XKP.__togglePaddingCharType('CHAR');
  },
};

/**
 * JQuery Document ready setup
 */

$(() => {
  // enable tooltips
  const tooltipTriggerList =
  document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));

  XKP.init();
});

