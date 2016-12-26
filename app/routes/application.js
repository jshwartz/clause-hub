import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get('session').fetch().catch(function() {
    });
  },
  afterModel: function() {
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('login');
    } else {
      this.transitionTo('library');
    }
  }


});
