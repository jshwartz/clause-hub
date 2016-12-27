import Ember from 'ember';

export default Ember.Controller.extend({
  passwordIsReset: null,
  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),
  firebaseApp: Ember.inject.service(),
  email: null,
  hasValidEmail: Ember.computed('email', function() {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(this.get('email'));
  }),
  password: null,
  hasValidPassword: Ember.computed.gt('password.length', 5),
  hasLoginErrors: Ember.computed('hasValidEmail', 'hasValidPassword', function() {
    const hasValidEmail = this.get('hasValidEmail');
    const hasValidPassword = this.get('hasValidPassword');
    if (hasValidEmail && hasValidPassword) {
      return false;
    } else {
      return true;
    }
  }),
  hasEmailErrors: Ember.computed('hasValidEmail', function() {
    const hasValidEmail = this.get('hasValidEmail');
    if (hasValidEmail) {
      return false;
    } else {
      return true;
    }
  }),

  signingUpWorking: false,


  validateLogin() {
    this.set('errors.email', this.get('hasValidEmail') ? null : "Please enter a valid email");
    this.set('errors.password', this.get('hasValidPassword') ? null : "Please enter valid password (minimum 6 characters)");
  },
  validateEmail() {
    this.set('errors.email', this.get('hasValidEmail') ? null : "Please enter a valid email");
  },
  login(provider) {
    this.get('session').open('firebase', {
      provider: provider,
      email: this.get('email') || '',
      password: this.get('password') || '',
    }).then(() => {
      var previousTransition = this.get('previousTransition');
      if (previousTransition) {
        this.set('previousTransition', null);
        previousTransition.retry();
      } else {
        this.transitionToRoute('library');
      }
      this.reset();
    }, (error) => {
      const errorMessage = error.message;
      this.set('errors.server', errorMessage);
      this.set('errorMessage', true);
    });
  },
  reset() {
    this.setProperties({
      email: null,
      password: null,
      signingUpWorking: false,
      errorMessage: false,
    });
    this.set('errors.email', null);
    this.set('errors.password', null);
    this.set('errors.server', null);
  },

  actions: {
    signIn(provider){
      this.validateLogin();
      if (this.get('hasLoginErrors')) {
        this.set('errorMessage', true);
        return false;
      }
      this.login(provider);
      return false;
    },
    resetPassword() {
      this.validateEmail();
      if (this.get('hasEmailErrors')) {
        this.set('errorMessage', true);
        return false;
      }
      const auth = this.get('firebaseApp').auth();
      const user = auth.currentUser;
      const email = this.get('email');
      const controller = this;
      auth.sendPasswordResetEmail(email).then(function() {
        controller.reset();
        controller.set('passwordIsReset', "Email has been sent to: " + email +". Follow the instructions in the email to reset your password. It may take a few minutes for the email to process. Please check your junk box if you do not receive an email in 5 or 10 minutes.");
      }, function(error) {
        controller.set('errors.server', error);
        controller.set('errorMessage', true);
      });
    },
    closePasswordMessage() {
      this.set('passwordIsReset', null);
    }
  }




});
