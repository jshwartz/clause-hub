import Ember from 'ember';

export default Ember.Route.extend({


  beforeModel(transition) {
    if (!this.get('session.isAuthenticated')) {
      alert('your not supposed to be here...');
    }
  },

  model() {
    return this.get('store').findRecord('user', this.get('session.currentUser.uid'));
  }


});
