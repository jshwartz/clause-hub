import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      clause: this.modelFor("library.fullClause"),
      users: this.get('store').findAll('user')
    });
  }
});
