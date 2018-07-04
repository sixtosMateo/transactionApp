// Wait for the DOM to be ready
$(function() {
  // Initialize form validation on the registration form.
  // It has the name attribute "registration"

  $("form[name='registration']").validate({
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      name: "required",
      cname: "required",
      email: {
        required: true,
        // Specify that email should be validated
        // by the built-in "email" rule
        email: true

      },
      contact: {
        required: true,
        minlength: 10
      }
    },
    // Specify validation error messages
    messages: {
      name: "Please enter your name",
      cname: "Please enter your company name",
      contact: {
        required: "Please provide a contact number"
      },
      email: "Please enter a valid email address1",
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      form.submit();
    }
  });
});
