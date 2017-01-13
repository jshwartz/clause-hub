import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model(params) {
    return RSVP.hash({
      group: this.get('store').findRecord('group', params.group_id),
      users: this.get('store').findAll('user')
    });
  }
});
