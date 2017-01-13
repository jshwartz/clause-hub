import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findRecord('user', this.get('session.currentUser.uid'));
  }
});
