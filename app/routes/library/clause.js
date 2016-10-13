import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({

  model(params) {
     return this.get('store').findRecord('clause', params.clause_id)
   },
});
