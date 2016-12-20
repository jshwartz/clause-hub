import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  currentUserID: Ember.computed('session.currentUser.uid', function() {
    return this.get('session.currentUser.uid');
  }),
  currentUser: Ember.computed('currentUserID', function(){
    return this.get('store').findRecord('user', this.get('currentUserID'));
  }),
});
