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

import './assets/site.css';
import {XKPasswd} from './lib/xkpasswd.mjs';

/**
 * Object defining all custom variables and functions
 * @namespace XKP
 *
 */
const XKP = {

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
      xkpasswd: new XKPasswd(),
    };

    XKP.setup();
  },

  /**
   * Handle the password generation.
   * This is the function that is called when clicking the `Generate` button.
   *
   * TODO: call the xkpasswd library to generate the password(s)
   *
   * @function generatePasswords
   * @memberof XKP
   * @param e - event
   */

  generatePasswords: (e) => {
    e.preventDefault();

    // call generatePasswords from library
    const passwords = XKP.config.xkpasswd.password();
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

    XKP.config.passwordArea.val(passwords);
    console.log('DEBUG texarea value changed to [' +
    XKP.config.passwordArea.val() + ']');
    e.stopPropagation(); // stop the event bubbling
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

