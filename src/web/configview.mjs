import log from 'loglevel';

/**
 * This class handles the rendering of
 * actions on custom settings
 *
 * This class takes care of the 2 menu items in the Actions menu
 * and the settingsLink with the base64encoded settings
 *
 * @class ConfigView
 */
class ConfigView {
  /**
   * @private {jQuery} savedSettingsLink - Readonly text input to display link
   * encoded settings
   */
  #savedSettingsLink;

  /**
   * @private {Object} copySettingsLink - copy button to copy the url
   */
  #copySettingsLink;

  #settingsDiv;

  constructor() {
    this.#savedSettingsLink = $('#savedSettingsLink');
    this.#copySettingsLink = $('#copySettingsLink');
    this.#settingsDiv = $('#settings-link');
  }

  /**
   * Bind the load config form, which is displayed by clicking on the 'import
   * settings' in the menu
   *
   * @param {Function} handle - pass control to the Controller to parse the JSON
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
   * @param {Function} handle - pass control to the Controller to build
   * the export JSON
   */
  bindSaveConfig(handle) {
    $('#form#exportConfigFile').on('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const name = e.target.name;

      let jsonBlob = new Blob([handle()], {type: 'application/json'});

      let tempLink = $('a')
        .attr('href', URL.createObjectURL(jsonBlob))
        .attr('download', `${name.toLowerCase()}.json`);
      tempLink.click();
      URL.revokeObjectURL(tempLink.href);
    });
  }

  /**
   * Bind the copy button in the settings link
   *
   * @param {Function} handle - pass control to the Controller to save the link
   */
  bindCopySettingsLink(handle) {
    this.#settingsDiv.on('click', () => {
      this.#savedSettingsLink.select();
      handle(this.#savedSettingsLink.val());
      this.#copySettingsLink.children('i').removeClass('bi-copy').fadeIn(500).addClass('bi-check');
      setTimeout(() => {
        this.#copySettingsLink.children('i').removeClass('bi-check').addClass('bi-copy');
      }, 1000);
    });
  };

  /**
   * Update the settings link
   *
   * @param {URL} url - the url to display
   */
  updateLink(url) {
    log.debug('ConfigView.updateLink');
    this.#savedSettingsLink.val(url);
  }
}

export {ConfigView};
