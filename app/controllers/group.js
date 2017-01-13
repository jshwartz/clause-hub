import Ember from 'ember';

export default Ember.Controller.extend({
  searchTerm: '',
  searchTermNotEmpty: Ember.computed.notEmpty('searchTerm'),
  searchResults: null,
  matchingUsers: Ember.computed('searchTerm', function() {
    var searchTerm = this.get('searchTerm').toLowerCase();
    return this.get('model.users').filter(function(user) {
      return user.get('fullName').toLowerCase().indexOf(searchTerm) !== -1;
    });
  }),
  mergedCurrentUsers: Ember.computed.union('model.clause.canReadUsers', 'model.clause.canWriteUsers', 'model.clause.adminUsers'),
  matchingNoCurrentUsers: Ember.computed('matchingUsers', 'mergedCurrentUsers', function() {
    return this.get('matchingUsers').removeObjects(this.get('mergedCurrentUsers'));
  }),

  actions: {
    addUser(user) {
      let group = this.get('model.group');
      user.get('groupsMember').pushObject(group);
      group.save().then(() => { 
        user.save();
        this.set('searchTerm', null);
      });
    },
    closeSearch() {
      this.set('searchTerm', null);
    },
  }

});
