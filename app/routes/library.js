import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  beforeModel(transition) {
    if (!this.get('session.isAuthenticated')) {
      const loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  },
  model(params) {
    return this.get('store').findRecord('library', params.library_id);
  },

  // afterModel(models, transition) {
  //   const color = models.library.get('color');
  //   if (color === "teal") {
  //     this.controllerFor('application').set('navColor', "ui p-teal inverted large borderless fixed top menu");
  //   } else if (color === "black") {
  //     this.controllerFor('application').set('navColor', "ui p-black inverted large borderless fixed top menu");
  //   }
  //   console.log(color);
  // }

});
