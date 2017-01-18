import Ember from 'ember';

export default Ember.Controller.extend({
  init() {
    this.get('store').findAll('user').then((users) =>{
      this.set('users', users);
    });
  },
  users: null,
  searchTerm: '',
  searchTermNotEmpty: Ember.computed.notEmpty('searchTerm'),
  searchResults: null,
  matchingUsers: Ember.computed('searchTerm', function() {
    var searchTerm = this.get('searchTerm').toLowerCase();
    return this.get('users').filter(function(user) {
      return user.get('fullName').toLowerCase().indexOf(searchTerm) !== -1;
    });
  }),
  mergedCurrentUsers: Ember.computed.union('model.members', 'model.managers'),
  matchingNoCurrentUsers: Ember.computed('matchingUsers', 'mergedCurrentUsers', function() {
    return this.get('matchingUsers').removeObjects(this.get('mergedCurrentUsers'));
  }),

  actions: {
    addUser(user) {
      user.get('groupsMember').pushObject(this.get('model'));
      this.get('model').save().then(() => {
        user.save();
        this.set('searchTerm', null);
      });
    },
    closeSearch() {
      this.set('searchTerm', null);
    },
  }

});
