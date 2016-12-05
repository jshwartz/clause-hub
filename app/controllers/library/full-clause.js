import Ember from 'ember';

export default Ember.Controller.extend({

  currentUser: Ember.computed('session.currentUser.uid', function() {
    return this.get('session.currentUser.uid');
  }),

  userCanWrite: Ember.computed('model', 'currentUser', function() {
    const currentUser = this.get('currentUser');
    const clauseWriteUsers = this.get('model.canWriteUsers');
    const owner = this.get('model.owner');
    let result = false;
    if (owner.get('id') === currentUser) {
      result = true;
      return result;
    }
    clauseWriteUsers.forEach((clauseUser) => {
      if (clauseUser.id === currentUser) {
        result = true;
      }
    });
    return result;
  }),


});
