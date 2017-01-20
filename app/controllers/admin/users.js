import Ember from 'ember';

export default Ember.Controller.extend({
  singleAdminClauses: null,
  updatingAdmin: false,
  newUserForm: false,
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
  validateNewUser() {
    this.set('errors.passwordMatch', this.get('passwordMatch') ? null : "Your passwords do not match");
    this.set('errors.firstName', this.get('hasFirstName') ? null : "First name is required");
    this.set('errors.lastName', this.get('hasLastName') ? null : "Last name is required");
    this.set('errors.email', this.get('hasValidEmail') ? null : "Please enter a valid email");
    this.set('errors.password', this.get('hasValidPassword') ? null : "Passwords must be 6 characters in length");
  },
  reset() {
    this.setProperties({
      email: null,
      password: null,
      passwordCheck: null,
      firstName: null,
      lastName: null,
      newUserForm: false,
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
      const user = userResponse;
      user.updateProfile({
        displayName: controller.get('firstName') + " " + controller.get('lastName'),
      }).then(function() {
        console.log(user.displayName);
        const databaseUser = controller.store.createRecord('user', {
          id: userResponse.uid,
          email: userResponse.email,
          firstName: controller.get('firstName'),
          lastName: controller.get('lastName')
        });
        controller.reset();
        return databaseUser.save();
      }, function(error) {
        console.log(error);
      });
    });
  },
  deleteUser(user) {
    let deletedFavorites = user.get('favoriteClauses').then((clauses) => {
      clauses.map((clause) => {
       clause.get('favoriteUsers').removeObject(user);
       return clause.save();
     });
    });
    let deletedAdmins = user.get('adminClauses').then((clauses) => {
      clauses.map((clause) => {
        clause.get('adminUsers').removeObject(user);
        return clause.save();
      });
    });
    let deletedCanReads = user.get('canReadClauses').then((clauses) => {
      clauses.map((clause) => {
        clause.get('canReadUsers').removeObject(user);
        return clause.save();
      });
    });
    let deletedCanWrites = user.get('canWriteClauses').then((clauses) => {
      clauses.map((clause) => {
        clause.get('canWriteUsers').removeObject(user);
        return clause.save();
      });
    });
    let deletions = [deletedFavorites, deletedAdmins, deletedCanReads, deletedCanWrites];
    Ember.RSVP.allSettled(deletions).then(function() {
      return user.destroyRecord();
    }).catch(function(errors) {
      console.log(errors);
    });
  },


  actions: {
    createUserLibrary(user) {
      const newlib = this.store.createRecord('library', {
        owner: user,
        type: "personal",
      });
      newlib.save().then(() => {
        user.save();
      })
    },
    openCreateUser() {
      this.set('newUserForm', true);
    },
    createUser(){
      this.validateNewUser();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        return false;
      }
      this.signUp();
      return false;
    },
    cancelCreateUser() {
      this.reset();
    },
    closeAdminClauseMessage() {
      this.set('singleAdminClauses', null);
    },
    countAdminClauses(user) {
      let singleAdminClauses = [];
      let deleteTrue = true;
      user.get('adminClauses').forEach((clause) => {
        const numberAdmins = clause.get('adminUsers.length');
        if (numberAdmins === 1) {
          singleAdminClauses.addObject(clause);
          deleteTrue = false;
        }
      });
      if (!deleteTrue) {
        this.set('singleAdminClauses', singleAdminClauses);
      } else {
        this.deleteUser(user);
      }
    },
    countAdminClausesNoDelete(user) {
      let singleAdminClauses = [];
      let deleteTrue = true;
      user.get('adminClauses').forEach((clause) => {
        const numberAdmins = clause.get('adminUsers.length');
        if (numberAdmins === 1) {
          singleAdminClauses.addObject(clause);
          deleteTrue = false;
        }
      });
      if (!deleteTrue) {
        this.set('singleAdminClauses', singleAdminClauses);
      }
    },
    toggleAdmin(user) {
      this.set('updatingAdmin', true);
      if (user.get('admin')) {
        user.set('admin', false);
        user.save().then(() => {
          this.set('updatingAdmin', false);
        }).catch(function(errors) {
          console.log(errors);
        });
      } else {
        user.set('admin', true);
        user.save().then(() => {
          this.set('updatingAdmin', false);
        }).catch(function(errors) {
          console.log(errors);
        });
      }
    }
  }
});
