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

// import site related css
import './assets/site.css';

// import all app related classes
import {XKPasswd} from './lib/xkpasswd.mjs';
import {PresetView} from './web/presetview.mjs';
import {PresetController} from './web/presetcontroller.mjs';
import {SettingsView} from './web/settingsview.mjs';
import {SettingsController} from './web/settingscontroller.mjs';
import {PasswordView} from './web/passwordview.mjs';
import {PasswordController} from './web/passwordcontroller.mjs';

/**
 * Object defining all custom variables and functions
 * @namespace XKP
 *
 */
const XKP = {

  presetController: {},
  settingsController: {},
  passwordController: {},
  xkpasswd: {},

  /**
   * init function that sets up the variables and the
   * views and controllers
   *
   * @function init
   * @memberof XKP
   */
  init: () => {
    // setup variables for key parts of the website
    XKP.xkpasswd = new XKPasswd();

    XKP.passwordController =
      new PasswordController(XKP.xkpasswd, new PasswordView());
    XKP.settingsController =
      new SettingsController(XKP.xkpasswd, new SettingsView());
    XKP.presetController = new PresetController(
      XKP.xkpasswd,
      new PresetView(),
      XKP.settingsController,
      XKP.passwordController);
  },
};

/**
 * JQuery Document ready setup
 */

$(() => {
  // enable tooltips
  const tooltipTriggerList = $('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));

  XKP.init();

  // Now that the DOM is ready, find all the 'div' elements that
  // were identified to have the potential to flash unstyled content
  // as the page loads and make them visible.
  const foucElements = document.querySelectorAll('div[fouc=\'true\']');
  for (const fouc of foucElements) {
    if (fouc.style !== null) {
      // Make the element visible.
      fouc.style.visibility = 'visible';
    }
  }
});
