import log from 'loglevel';

/**
 * @class This class handles the rendering of
 * actions on custom settings.
 *
 * This class takes care of the 2 menu items in the Actions menu
 * and the config Url with the base64encoded settings.
 *
 * @constructor
 */
class ConfigView {
  /**
   * @private {jQuery} configUrl - Readonly text input to display the url
   * encoded settings
   */
  #configUrl;

  /**
   * @private {Object} configURLBtn - copy button to copy the url
   */
  #configUrlBtn;

  /*
   * @private {Object} configUrlBox - div containing the button and input text
   * for the config url
   */
  #configUrlBox;

  constructor() {
    this.#configUrl = $('#configUrl');
    this.#configUrlBtn = $('#copyConfigUrlBtn');
    this.#configUrlBox = $('#configUrlBox');
  }

  /**
   * Bind the load config form, which is displayed by clicking on the 'import
   * settings' in the menu
   *
   * @param {function} handle - pass control to the Controller to parse the JSON
   * file
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

      // Set up the callback event to run when the file is read
      reader.onload = (event) => {
        const json = JSON.parse(event.target.result);
        log.trace(`json: ${JSON.stringify(json)}`);
        handle(json); // handle the JSON file
      };

      // Read the file
      reader.readAsText(files[0]);
    });
  }

  /**
   * Handle the saving of the configuration as JSON file
   *
   * @param {function} handle - pass control to the Controller to build
   * the export JSON
   */
  bindSaveConfig(handle) {
    $('#save_config').on('show.bs.modal',  (e) => {
      const url = handle();
      $('#save').attr('href', url);
    });
  }

  /**
   * Bind the copy button in the configUrlBox
   *
   * @param {function} handle - pass control to the Controller to save the link
   */
  bindConfigUrlBox(handle) {
    this.#configUrlBox.on('click', () => {
      this.#configUrl.select();
      handle(this.#configUrl.val());
      this.#configUrlBtn.children('i')
        .removeClass('bi-copy')
        .fadeIn(500).addClass('bi-check');
      setTimeout(() => {
        this.#configUrlBtn.children('i')
          .removeClass('bi-check').addClass('bi-copy');
      }, 1000);
    });
  };

  /**
   * Update the settings link
   *
   * @param {URL} url - the url to display
   */
  updateLink(url) {
    this.#savedSettingsLink.val(url);
  }
}

export {ConfigView};
