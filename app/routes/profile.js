import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel(transition) {
      if (!this.get('session.isAuthenticated')) {
        const loginController = this.controllerFor('login');
        loginController.set('previousTransition', transition);
        this.transitionTo('login');
      }
    },
    model() {
      return this.get('store').findRecord('user', this.get('session.currentUser.uid'));
    }
  });
