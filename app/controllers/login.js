import Ember from 'ember';

export default Ember.Controller.extend({
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
  signingUpWorking: false,


  validateLogin() {
    this.set('errors.email', this.get('hasValidEmail') ? null : "Please enter a valid email");
    this.set('errors.password', this.get('hasValidPassword') ? null : "Please enter valid password (minimum 6 characters)");
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
    }
  }




});
