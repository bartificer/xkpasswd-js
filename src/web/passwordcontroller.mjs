/* istanbul ignore file @preserve */

/**
 * @module web/PasswordController
 */
import log from 'loglevel';

/**
 * @class This class handles the section of the actual passwords.
 * So the generation of the passwords and statistics.
 *
 * @constructor
 */
class PasswordController {
  /**
   * model - reference to password model
   */
  #model;

  /**
   * view - reference to PasswordView
   */
  #view;

  /**
   * Constructor
   *
   * @param {XKPasswd} model - new PasswordModel
   * @param {PasswordView} view - new PasswordView
   */
  constructor(model, view) {
    this.#model = model;
    this.#view = view;

    this.#view.bindGeneratePassword(this.generatePasswords);

    log.trace('PasswordController constructor executed');
  }

  /**
   * Handle the password generation. This method is passed to the
   * [bindGeneratePassword method of the PasswordView class]{@link PasswordView#bindGeneratePassword}
   * as the
   * function to handle the actual generation of the passwords.
   *
   * @param {number} num - number of passwords to generate
   * @function
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

  /**
   * Clear the passwords that are generated
   */
  clearPasswords() {
    this.#view.clearPasswordArea();
  }
}

export {PasswordController};
