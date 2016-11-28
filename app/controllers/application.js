import Ember from 'ember';

export default Ember.Controller.extend({
  firebaseApp: Ember.inject.service(),
  email: null,
  password: null,
  signInModal: true,

  signIn(provider) {
    let controller = this;
    this.get('session').open('firebase', {
      provider: provider,
      email: this.get('email') || '',
      password: this.get('password') || '',
    }).then(() => {
      controller.set('email', null);
      controller.set('password', null);
    }, (error) => {
      console.log(error);
    });
  },
  signUp() {
    let controller = this;
    const auth = this.get('firebaseApp').auth();
    const email = this.get('email');
    const password = this.get('password');
    auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      console.log(error);
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    }).then((userResponse) => { console.log(userResponse); });
  },

  actions: {
    openSignIn() {
      $('.ui.sign-in.modal').modal('show');
    },
    signInUp(provider){
      if (this.get('signInModal')) {
        this.signIn(provider);
      } else {
        this.signUp();
      }
    },
    signOut() {
      this.get('session').close();
    },
    changeToSignUp() {
      this.set('signInModal', false);
    }
  }
});
