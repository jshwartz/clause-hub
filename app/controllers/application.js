import Ember from 'ember';

export default Ember.Controller.extend({
  firebaseApp: Ember.inject.service(),
  email: null,
  hasValidEmail: Ember.computed('email', function() {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(this.get('email'));
  }),
  password: null,
  hasValidPassword: Ember.computed.gt('password.length', 5),
  passwordCheck: null,
  firstName: null,
  hasFirstName: Ember.computed.notEmpty('firstName'),
  lastName: null,
  hasLastName: Ember.computed.notEmpty('lastName'),
  signInModal: true,
  signingUpWorking: false,
  passwordMatch: Ember.computed('password', 'passwordCheck', function() {
    if (this.get('password')===this.get('passwordCheck') ) { return true; }
  }),
  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),
  hasErrors: Ember.computed('passwordMatch', 'hasFirstName', 'hasLastName', 'hasValidEmail', 'hasValidPassword', function() {
    const passwordMatch = this.get('passwordMatch');
    const hasFirstName = this.get('hasFirstName');
    const hasLastName = this.get('hasLastName');
    const hasValidEmail = this.get('hasValidEmail');
    const hasValidPassword = this.get('hasValidPassword');
    if (passwordMatch && hasFirstName && hasLastName && hasValidEmail && hasValidPassword) {
      return false;
    } else {
      return true;
    }
  }),
  hasLoginErrors: Ember.computed('hasValidEmail', 'hasValidPassword', function() {
    const hasValidEmail = this.get('hasValidEmail');
    const hasValidPassword = this.get('hasValidPassword');
    if (hasValidEmail && hasValidPassword) {
      return false;
    } else {
      return true;
    }
  }),
  currentUser: Ember.computed('session.currentUser', function() {
    if (this.get('session.currentUser.uid')) {
      const userID = this.get('session.currentUser.uid');
      return this.get('store').findRecord('user', userID );
    }
    return null;
  }),

  validateNewUser() {
    this.set('errors.passwordMatch', this.get('passwordMatch') ? null : "Your passwords do not match");
    this.set('errors.firstName', this.get('hasFirstName') ? null : "First name is required");
    this.set('errors.lastName', this.get('hasLastName') ? null : "Last name is required");
    this.set('errors.email', this.get('hasValidEmail') ? null : "Please enter a valid email");
    this.set('errors.password', this.get('hasValidPassword') ? null : "Passwords must be 6 characters in length");
  },
  validateLogin() {
    this.set('errors.email', this.get('hasValidEmail') ? null : "Please enter a valid email");
    this.set('errors.password', this.get('hasValidPassword') ? null : "Please enter valid password (minimum 6 characters)");
  },
  reset() {
    this.setProperties({
      email: null,
      password: null,
      passwordCheck: null,
      firstName: null,
      lastName: null,
      signInModal: true,
      signingUpWorking: false,
      errorMessage: false,
    });
    this.set('errors.passwordMatch', null);
    this.set('errors.firstName', null);
    this.set('errors.lastName', null);
    this.set('errors.email', null);
    this.set('errors.password', null);
    this.set('errors.server', null);
  },
  signIn(provider) {
    let controller = this;
    this.get('session').open('firebase', {
      provider: provider,
      email: this.get('email') || '',
      password: this.get('password') || '',
    }).then(() => {
      $('.ui.sign-in.modal').modal('hide');
      this.reset();
    }, (error) => {
      const errorMessage = error.message;
      this.set('errors.server', errorMessage);
      this.set('errorMessage', true);
    });
  },
  signUp() {
    let controller = this;
    controller.set('signingUpWorking', true);
    const auth = this.get('firebaseApp').auth();
    const email = this.get('email');
    const password = this.get('password');
    auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
      const errorMessage = error.message;
      controller.set('errors.server', errorMessage);
      controller.set('errorMessage', true);
      controller.set('signingUpWorking', false);
    }).then((userResponse) => {
      const user = this.store.createRecord('user', {
        id: userResponse.uid,
        email: userResponse.email,
        firstName: this.get('firstName'),
        lastName: this.get('lastName')
      });
      $('.ui.sign-in.modal').modal('hide');
      this.reset();
      return user.save();
    });
  },

  actions: {
    openSignIn() {
      $('.ui.sign-in.modal').modal('show');
    },
    openSignUp() {
      this.set('signInModal', false);
      $('.ui.sign-in.modal').modal('show');
    },
    signInUp(provider){
      if (this.get('signInModal')) {
        this.validateLogin();
        if (this.get('hasLoginErrors')) {
          this.set('errorMessage', true);
          return false;
        }
        this.signIn(provider);
        return false;
      } else {
        this.validateNewUser();
        if (this.get('hasErrors')) {
          this.set('errorMessage', true);
          return false;
        }
        this.signUp();
        return false;
      }
    },
    signOut() {
      this.get('session').close().then(() => {
        this.transitionToRoute('login');
      });
    },
    changeToSignUp() {
      this.set('signInModal', false);
    },
    changeToSignIn() {
      this.set('signInModal', true);
    },
    onHidden() {
      this.reset();
    },
    openMobileMenu() {
      $('.ui.mobilemenu.modal').modal('show');
    }
  }
});
