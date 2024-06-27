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
import {Config} from './web/config.mjs';

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
  init: (settings) => {
    let preset = "DEFAULT";

    // setup variables for key parts of the website
    XKP.xkpasswd = new XKPasswd(),

    XKP.passwordController =
      new PasswordController(XKP.xkpasswd, new PasswordView());
    XKP.settingsController =
      new SettingsController(XKP.xkpasswd, new SettingsView());

    // If settings are passed by URL update the settingsController
    if (typeof settings !== 'undefined' && settings != null) {
      XKP.xkpasswd.setCustomPreset(settings);
      XKP.settingsController.importSettings(settings);
      preset = "CUSTOM";
    }

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
  const tooltipTriggerList =
  document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));

  const savedSettingsLink = $('#savedSettingsLink');
  const copySettingsLink = $('#copySettingsLink');

  // Load custom settings if present in the URL
  const config = new Config();
  config.loadFromUrl(document.location);

  XKP.init(config.getSettings());

  // Display the CUSTOM preset button if loaded custom settings
  savedSettingsLink.val("");
  if (config.isLoaded()) {
    const custom = $("[data-preset='CUSTOM']");
    custom.show();
    custom.addClass("active");
    savedSettingsLink.val(window.location);
  }

  copySettingsLink.bind('click', () => {
    savedSettingsLink.select();
    navigator.clipboard.writeText(savedSettingsLink.val());
    copySettingsLink.children("i").removeClass("bi-copy").fadeIn(500).addClass("bi-check");
    setTimeout( () => {
      copySettingsLink.children("i").removeClass("bi-check").addClass("bi-copy");
    }, 1000);
  });

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
