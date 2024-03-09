/* istanbul ignore file @preserve */

import log from 'loglevel';

/**
 * @class PasswordController
 */
class PasswordController {
  /**
   * @private model - reference to password model
   */
  #model;

  /**
   * @private view - reference to PasswordView
   */
  #view;

  /**
   * @constructor
   *
   * @param {PasswordModel} model - new PasswordModel
   * @param {PasswordView} view - new PasswordView
   */
  constructor(model, view) {
    this.#model = model;
    this.#view = view;

    this.#view.bindGeneratePassword(this.generatePasswords);
    log.trace('PasswordController constructor executed');
  }

  /**
   * Handle the password generation.
   *
   * @function generatePasswords
   * @param {number} num - number of passwords to generate
   */
  generatePasswords = (num) => {
    // call generatePasswords from library

    try {
      const passAndStats = this.#model.generatePassword(num);

      log.trace(`generatePasswords: ${JSON.stringify(passAndStats.passwords)}`);
      log.trace(`stats ${JSON.stringify(passAndStats.stats)}`);
      if (!passAndStats) {
        // something went wrong
        throw new Error('ERROR - server returned no passwords');
      }
      this.#view.renderPassword(passAndStats, num);
    } catch (error) {
      log.error(`Password generation threw an error ${error}`);
      this.#view.renderPasswordError('ERROR password generation failed!');
    }
  };
};

export {PasswordController};
