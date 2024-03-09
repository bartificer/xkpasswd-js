import log from 'loglevel';

/**
 * This class handles the rendering of
 * and interaction with the password and stats
 *
 * @class PasswordView
 */
class PasswordView {
  /**
   * @private {number} aniTime - set time to show/hide elements
   */
  #aniTime = 250;

  /**
   *  set the Bootstrap classes for the various values
   * @private
   */
  #stats_classes = {
    GOOD: {
      display: 'Good',
      class: 'btn-success',
    },
    OK: {
      display: 'OK',
      class: 'btn-warning',
    },
    POOR: {
      display: 'Poor',
      class: 'btn-danger',
    },
    UNKNOWN: {
      display: 'Unknown',
      class: 'btn-danger',
    },
  };

  #passwordPresentation;
  #passwordPresentationRadio;
  #passwordList;
  #passwordText;
  #passwordErrorContainer;
  #passwordStatsContainer;
  #passwordStrength;
  #blindEntropy;
  #seenEntropy;
  #entropySuggestion;
  #numberOfPasswords;
  /**
   * @constructor
   */
  constructor() {
    this.#passwordPresentation = $('#password_presentation');
    this.#passwordPresentationRadio = $('input:radio[name=pwdPresentation]');
    this.#passwordList = $('ul#generated_password_lst');
    this.#passwordText = $('#generated_password_txt');
    this.#passwordErrorContainer = $('#passwordErrorContainer');
    this.#passwordStatsContainer = $('#password_stats_container');
    this.#passwordStrength = $('#password_strength');
    this.#blindEntropy = $('#entropy_blind');
    this.#seenEntropy = $('#entropy_seen');
    this.#entropySuggestion = $('#entropy_suggestion');
    this.#numberOfPasswords = $('#selectAmount');

    // Register for changes to the password presentation mode.
    for (const item of this.#passwordPresentationRadio) {
      try {
        item.addEventListener('change', async ()=>{
          this.__updatePasswordUI();
        });
      } catch (err) {
        log.trace('Error registering for password presentation events.');
      }
    }

    this.__resetPasswordUI();
    this.__hideStats();
  };

  /**
   * Reset the password UI elements.
   */
  __resetPasswordUI() {
    this.#passwordPresentation.addClass('d-none');
    this.#passwordList.html('');
    this.#passwordText.val('');
    // Make both password content elements invisble.
    this.#passwordList.addClass('d-none');
    this.#passwordText.addClass('d-none');

    // Clear out existing events.
    const existingListItems = this.#passwordList.find('button');
    for (const item of existingListItems) {
      if (item.hasOwnProperty('removeEventListener')) {
        item.removeEventListener('click');
      }
    }
  }

  /**
   * Update the password UI elements
   * based upon the password presentation mode.
   */
  __updatePasswordUI() {
    // Show the presentation selection
    this.#passwordPresentation.removeClass('d-none');

    // Get the password presentation mode.
    // eslint-disable-next-line max-len
    const pwdPresentation = $('input:radio[name=pwdPresentation]:checked').val();
    if (pwdPresentation === 'lst') {
      // Hide the text area
      this.#passwordText.addClass('d-none');
      // Show the list container
      this.#passwordList.removeClass('d-none');
    } else {
      // Cache the current password text.
      const currentPasswords = this.#passwordText.val();
      // Clear the passwords (to help manage focus)
      this.#passwordText.val('');
      // Put the passwords back. (focus has been reset).
      this.#passwordText.val(currentPasswords);

      // Hide the list container
      this.#passwordList.addClass('d-none');
      // Show the text area container
      this.#passwordText.removeClass('d-none');
      // Select the password text.
      this.#passwordText[0].select();
    }
  }

  /**
   * Render the password and statistics
   *
   * @param {Object} passAndStats - object with passwords and stats
   * @param {number} num - number of passwords generated
   */
  renderPassword(passAndStats, num) {
    log.trace(`renderPassword: ${JSON.stringify(passAndStats)}`);

    this.__resetPasswordUI();

    // Populate the password list.
    if (passAndStats.passwords) {
      let htmlPwdList='';
      // eslint-disable-next-line guard-for-in
      for (const pwdIndex in passAndStats.passwords) {
        // Make the index a number so we can perform math as needed.
        const theIndex = Number.parseInt(pwdIndex);

        htmlPwdList = htmlPwdList.concat(`
            <li>
                <button id="copyclip_${theIndex}"
                        class="btn btn-clipboard bi-clipboard"
                        aria-label="Copy Password #${theIndex+1}">
                </button>
                ${passAndStats.passwords[theIndex]}
            </li>
        `);
      }
      this.#passwordList.html(htmlPwdList);

      // Add event handlers for the copy buttons
      // eslint-disable-next-line guard-for-in
      for (const pwdIndex in passAndStats.passwords) {
        const btn = $(`#copyclip_${pwdIndex}`);
        if (btn && (btn.length > 0)) {
          btn[0].addEventListener('click', async ()=>{
            // eslint-disable-next-line max-len
            await navigator.clipboard.writeText(passAndStats.passwords[pwdIndex]);
          });
        }
      }

      // Update the text area
      this.#passwordText.val(passAndStats.passwords.join('\n'));
      // Set passwordArea height to accommodate number of passwords
      this.#passwordText.attr('rows', num);

      // Update the Password UI elements.
      this.__updatePasswordUI();
    }

    this.__renderDetailedStats(passAndStats.stats);
  };

  /**
   * bind the Generate button to the eventhandler
   * @param {Function} handle - pass control to the Controller
   */
  bindGeneratePassword(handle) {
    log.trace('bindGeneratePassword');

    $('form#generatePasswords').on('submit', (e) => {
      e.preventDefault();
      e.stopPropagation(); // stop the event bubbling

      const num = parseInt(this.#numberOfPasswords.val());
      handle(num);
    });
  };


  /**
   * hide statistics section
   *
   * @private
   */
  __hideStats() {
    this.#passwordStatsContainer.addClass('d-none');
  };

  /**
   * show statistics section
   *
   * @private
   */
  __showStats() {
    this.#passwordStatsContainer.removeClass('d-none');
  };

  /**
   * Show an alert with an error message
   * @param {string} msg - the error message
   *
   */
  renderPasswordError(msg) {
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

    this.#passwordErrorContainer.append(alertBox);

    this.__hideStats();
  };

  /**
   * Render the details of the statistics
   * @param {object} stats - object holding the statistics
   *
   * @private
   */
  __renderDetailedStats(stats) {
    log.trace(`entering __renderDetailedStats`);
    log.trace(`stats: ${JSON.stringify(stats)}`);

    this.__renderPasswordStrength(stats.password.passwordStrength);

    // Render the detailed stats

    let template = {};
    const min = stats.entropy.minEntropyBlind;
    const max = stats.entropy.maxEntropyBlind;

    // first the blind entropy

    /* eslint-disable max-len */

    if (min.equal) {
      // make a template for one value

      template = [
        `<span class="btn btn-stats ${this.__getStatsClass([min.state])}"`,
        `id="entropy_min">${min.value} bits</span>`,
      ].join('');
    } else {
      // make a template for two values
      template = [
        `&nbsp;between <span class="btn btn-stats ${this.__getStatsClass([min.state])}"`,
        `id="entropy_min">${min.value} bits</span> and `,
        `<span class="btn btn-stats ${this.__getStatsClass([max.state])}"`,
        `id="entropy_max">${max.value} bits</span>`,
      ].join('');
    }
    /* eslint-enable max-len */

    log.trace(`template built: ${template}`);


    this.#blindEntropy.empty().append(template);

    // full knowledge (seen) entropy
    this.#seenEntropy.html(stats.entropy.entropySeen.value + ' bits')
      .addClass(this.#stats_classes[stats.entropy.entropySeen.state]);

    const suggestion =
      // eslint-disable-next-line max-len
      `(suggest keeping blind entropy above ${stats.entropy.blindThreshold} bits ` +
      `and full knowledge above ${stats.entropy.seenThreshold} bits)`;
    this.#entropySuggestion.html(suggestion);

    this.__showStats();
  };

  /**
   * Render the password strength
   *
   * @param {string} passwordStrength - indication of the password strength
   */
  __renderPasswordStrength(passwordStrength) {
    // we assume that the strength indicator is already calculated

    const statsText = this.__getStatsDisplay(passwordStrength);
    const statsClass = this.__getStatsClass([passwordStrength]);

    // render strength
    this.#passwordStrength.text(statsText);
    this.#passwordStrength.addClass(statsClass);
  };

  /**
   * Return the Bootstrap class to indicate the strength
   *
   * @private
   *
   * @param {string} strength - indication of strength
   * @return {string} - css class
   */
  __getStatsClass(strength) {
    return this.#stats_classes[strength].class;
  };

  /**
   * Return the display name to indicate the strength
   *
   * @param {string} strength - indication of strength
   * @return {string} - display name
   *
   * @private
   */
  __getStatsDisplay(strength) {
    return this.#stats_classes[strength].display;
  }
};

export {PasswordView};
