import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({

  model(params) {
     return RSVP.hash({
       clause: this.get('store').findRecord('clause', params.clause_id),
       blocks: this.get('store').query('block', { clause: params.clause_id })
     });
   }




});
