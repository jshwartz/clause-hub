import Ember from 'ember';

export default Ember.Controller.extend({
  //setup member list
  membersManagers: Ember.computed('model.members', 'model.managers', function(){
    const members = this.get('model.members');
    const managers = this.get('model.managers');
    let singleManager = false;
    if (managers.get('length') < 2) {
      singleManager = true;
    }
    let result = [];
    members.forEach((member) => {
      let isManager = managers.find((manager)=> {
        return manager.get('id') === member.get('id');
      });
      if (isManager && singleManager) {
        result.pushObject({manager: true, singleManager: true, name: member.get('firstName'), object: member});
      } else if (isManager) {
        result.pushObject({manager: true, singleManager: false, name: member.get('firstName'), object: member});
      } else {
        result.pushObject({manager: false, singleManager: false, name: member.get('firstName'), object: member});
      }
    });
    return result;
  }),
  membersSort: ['name'],
  sortedMembersManagers: Ember.computed.sort('membersManagers', 'membersSort'),
  //set up user searcj
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
  //metadata editing stuff
  isEditing: false,
  libraryName: null,
  libraryNameNotEmpty: Ember.computed.notEmpty('libraryName'),
  libraryDescription: null,
  libraryDescriptionNotEmpty: Ember.computed.notEmpty('libraryDescription'),
  hasErrors: Ember.computed('libraryNameNotEmpty', 'libraryDescriptionNotEmpty', function() {
    const libraryNameNotEmpty = this.get('libraryNameNotEmpty');
    const libraryDescriptionNotEmpty = this.get('libraryDescriptionNotEmpty');
    if (libraryNameNotEmpty && libraryDescriptionNotEmpty) {
      return false;
    } else {
      return true;
    }
  }),
  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),
  resetMetadata() {
    this.set('libraryName', this.get('model.name'));
    this.set('libraryDescription', this.get('model.description'));
    this.set('errorMessage', null);
    this.set('errors.name', null);
    this.set('errors.description', null);
  },
  validate() {
    this.set('errors.name', this.get('libraryNameNotEmpty') ? null : "Library name required");
    this.set('errors.description', this.get('libraryDescriptionNotEmpty') ? null : "Library description required.");
  },

  actions: {
    openEdit() {
      this.resetMetadata();
      this.set('isEditing', true);
    },
    closeEdit() {
      this.set('isEditing', false);
    },
    saveMetadata() {
      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        return;
      }
      const model = this.get('model');
      model.set('name', this.get('libraryName'));
      model.set('description', this.get('libraryDescription'));
      model.save().then(() => {
        this.set('isEditing', false);
      });
    },
    updateManager(person) {
      const library = this.get('model');
      if (person.manager) {
        library.get('managers').removeObject(person.object);
        library.save().then(() => {
          person.object.save();
        });
      } else {
        library.get('managers').pushObject(person.object);
        library.save().then(() => {
          person.object.save();
        });
      }
    },
    removeMember(person) {
      const library = this.get('model');
      library.get('managers').removeObject(person);
      library.get('members').removeObject(person);
      library.save().then(() => {
        person.save();
      });
    },
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
