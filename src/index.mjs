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
      xkpasswd: new XKPasswd(),
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
   * hide statistics section
   */
  __hideStats() {
    XKP.config.passwordStatsContainer.addClass('d-none');
  },

  /**
   * show statistics section
   */
  __showStats() {
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
    XKP.__hideStats();
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

