import Ember from 'ember';

export default Ember.Controller.extend({
  firebaseApp: Ember.inject.service(),
  currentEmail: Ember.computed('session.currentUser', function() {
    return this.get('session.currentUser.email');
  }),
  passwordIsReset: null,
  isEditing: false,
  firstName: null,
  firstNameNotEmpty: Ember.computed.notEmpty('firstName'),
  lastName: null,
  lastNameTextNotEmpty: Ember.computed.notEmpty('lastName'),
  company: null,
  hasErrors: Ember.computed('firstNameNotEmpty', 'lastNameTextNotEmpty', function() {
    const firstNameNotEmpty = this.get('firstNameNotEmpty');
    const lastNameTextNotEmpty = this.get('lastNameTextNotEmpty');
    if (firstNameNotEmpty && lastNameTextNotEmpty) {
      return false;
    } else {
      return true;
    }
  }),
  isEmailEditing: false,
  email: null,
  hasValidEmail: Ember.computed('email', function() {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(this.get('email'));
  }),
  hasEmailErrors: Ember.computed('hasValidEmail', function() {
    const hasValidEmail = this.get('hasValidEmail');
    if (hasValidEmail) {
      return false;
    } else {
      return true;
    }
  }),
  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),
  resetProfileData() {
    this.set('firstName', this.get('model.firstName'));
    this.set('lastName', this.get('model.lastName'));
    this.set('company', this.get('model.company'));
    this.set('email', this.get('currentEmail'));
    this.set('errors.firstName', null);
    this.set('errors.lastName', null);
    this.set('errorMessage', null);
    this.set('errors.email', null);
  },
  validate() {
    this.set('errors.firstName', this.get('firstNameNotEmpty') ? null : "First name required");
    this.set('errors.lastName', this.get('lastNameNotEmpty') ? null : "Last name required.");
  },
  validateEmail() {
    this.set('errors.email', this.get('hasValidEmail') ? null : "Please enter a valid email");
  },
  saveProfileData() {
    this.set('model.firstName', this.get('firstName'));
    this.set('model.lastName', this.get('lastName'));
    this.set('model.company', this.get('company'));
    this.get('model').save().then(() => {
      this.updateAuthProfile();
      this.set('isEditing', false);
    }).catch(function(errors) {
      console.log(errors);
    });
  },
  updateAuthProfile() {
    const auth = this.get('firebaseApp').auth();
    const user = auth.currentUser;
    user.updateProfile({
      displayName: this.get('firstName') + " " + this.get('lastName'),
    }).then(function() {
      console.log(user.displayName);
    }, function(error) {
      console.log(error);
    });
  },
  saveEmailData() {
    this.set('model.email', this.get('email'));
    this.get('model').save().then(() => {
      this.set('isEmailEditing', false);
    }).catch(function(errors) {
      console.log(errors);
    });
  },
  updateAuthEmail() {
    const auth = this.get('firebaseApp').auth();
    const user = auth.currentUser;
    const controller = this;
    user.updateEmail(this.get('email')).then(function() {
      controller.saveEmailData();
    }, function(error) {
      controller.set('errors.server', error);
      controller.set('errorMessage', true);
    });
  },


  actions: {
    openEdit() {
      this.set('isEditing', true);
      this.resetProfileData();
    },
    closeEdit() {
      this.set('isEditing', false);
    },
    openEmailEdit() {
      this.set('isEmailEditing', true);
      this.resetProfileData();
    },
    closeEmailEdit() {
      this.set('isEmailEditing', false);
    },
    saveProfile() {
      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        return;
      }
      this.saveProfileData();
    },
    saveEmail() {
      this.validateEmail();
      if (this.get('hasEmailErrors')) {
        this.set('errorMessage', true);
        return;
      }
      this.updateAuthEmail();
    },
    resetPassword() {
      const auth = this.get('firebaseApp').auth();
      const user = auth.currentUser;
      const email = user.email;
      const controller = this;
      auth.sendPasswordResetEmail(email).then(function() {
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
