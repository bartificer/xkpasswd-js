// This javascript only handles the update of the webapp. 
// The actual password generation is done in the xkpasswd library
// add a document ready event handler

// setup of this file inspired by: https://learn.jquery.com/code-organization/



const XKP = {

  init: () => {
   // setup variables for key parts of the website
    XKP.config = {
      passwordArea: $('textarea#generated_password')
    };

    XKP.setup();
  },
 
  // Generate passwords
  //
  // To do: call the xkpasswd library to generate the password(s)
  // update the text area

  generatePasswords: (e) => {
    e.preventDefault();

    // call generatePasswords from library
    const passwords = '123';

    XKP.config.passwordArea.val(passwords);
    console.log('DEBUG texarea value changed to [' + XKP.config.passwordArea.val() + ']');
    e.stopPropagation(); // stop the event bubbling
  },

  // set up the generate button click

  setup: () => {
    XKP.config.passwordArea.val('');
    $('form#generatePasswords').on('submit', XKP.generatePasswords);
  }
};

$(document).ready(function () {
  // enable tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  XKP.init();
});

