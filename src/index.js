/**
 * @file This file only handles the update of the webapp.
 *
 * The actual password generation is done in the xkpasswd library.
 *
 * setup of this file inspired by: https://learn.jquery.com/code-organization/
 *
 */


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
    const passwords = '123';

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
 * Document ready setup
 */
$(document).ready(function() {
  // enable tooltips
  const tooltipTriggerList =
  document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

  XKP.init();
});

