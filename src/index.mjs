/**
 * @file This file only handles the update of the webapp.
 *
 * The actual password generation is done in the xkpasswd library.
 *
 * setup of this file inspired by: https://learn.jquery.com/code-organization/
 *
 */

// import bootstrap plugins
import { Tooltip, Modal, Popover } from 'bootstrap';

// import bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import './assets/site.css';
import {XKPasswd} from './lib/xkpasswd.mjs';

/**
 * Object defining all custom variables and functions
 * @namespace XKP
 *
 */
const XKP = {

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

