import Ember from 'ember';

export default Ember.Controller.extend({

  currentUser: Ember.computed('session.currentUser.uid', function() {
    return this.get('session.currentUser.uid');
  }),
  adminUser123: null,
  userAdmin:  Ember.computed('model', 'currentUser', function() {
    const currentUser = this.get('currentUser');
    const adminUsers = this.get('model.adminUsers');
    let result = false;
    if (!currentUser) {
      return result;
    }
    adminUsers.forEach((user) => {
      if (user.id === currentUser) {
        result = true;
      }
    });
    return result;

  }),
  userCanWrite: Ember.computed('model', 'currentUser', function() {
    const currentUser = this.get('currentUser');
    const clauseWriteUsers = this.get('model.canWriteUsers');
    let result = false;
    if (!currentUser) {
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
