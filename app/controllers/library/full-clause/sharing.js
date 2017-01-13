import Ember from 'ember';

export default Ember.Controller.extend({
  user: Ember.inject.service(),

  showReadOverTarget: false,
  isEditing: false,
  titleText: null,
  titleTextNotEmpty: Ember.computed.notEmpty('titleText'),
  subtitleText: null,
  subtitleTextNotEmpty: Ember.computed.notEmpty('subtitleText'),
  headerText: null,
  hasErrors: Ember.computed('titleTextNotEmpty', 'subtitleTextNotEmpty', function() {
    const titleTextNotEmpty = this.get('titleTextNotEmpty');
    const subtitleTextNotEmpty = this.get('subtitleTextNotEmpty');
    if (titleTextNotEmpty && subtitleTextNotEmpty) {
      return false;
    } else {
      return true;
    }
  }),
  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),
  resetClauseData() {
    const metadata = this.get('model.clause.metadata');
    this.set('titleText', metadata.title);
    this.set('subtitleText', metadata.subTitle);
    this.set('headerText', metadata.header);
    this.set('errors.title', null);
    this.set('errors.subtitle', null);
    this.set('errorMessage', null);
  },
  saveClauseData() {
    const clause = this.get('model.clause');
    clause.set('metadata.title', this.get('titleText'));
    clause.set('metadata.subTitle', this.get('subtitleText'));
    clause.set('metadata.header', this.get('headerText'));
    this.get('model.clause').save().then(() => {
      this.set('isEditing', false);
    });
  },
  validate() {
    this.set('errors.title', this.get('titleTextNotEmpty') ? null : "Title required");
    this.set('errors.subtitle', this.get('subtitleTextNotEmpty') ? null : "Subtitle required.");
  },


  onlyOneAdmin: Ember.computed('model.clause.adminUsers', function() {
    if (this.get('model.clause.adminUsers.length') < 2) {
      return true;
    } else {
      return false;
    }
  }),

  //search stuff
  searchOptions: ["People", "Groups"],
  selectedSearchOption: "People",
  searchPeople: Ember.computed('selectedSearchOption', function(){
    if (this.get('selectedSearchOption').toLowerCase() === "people") {
      this.set('searchTermGroup', '');
      return true;
    } else {
      this.set('searchTermPeople', '');
      return false;
    }
  }),
  searchTermPeople: '',
  searchTermGroup: '',
  searchTermPeopleNotEmpty: Ember.computed.notEmpty('searchTermPeople'),
  searchTermGroupNotEmpty: Ember.computed.notEmpty('searchTermGroup'),
  matchingUsers: Ember.computed('searchTermPeople', function() {
    var searchTerm = this.get('searchTermPeople').toLowerCase();
    return this.get('model.users').filter(function(user) {
      return user.get('fullName').toLowerCase().indexOf(searchTerm) !== -1;
    });
  }),
  mergedCurrentUsers: Ember.computed.union('model.clause.canReadUsers', 'model.clause.canWriteUsers', 'model.clause.adminUsers'),
  matchingNoCurrentUsers: Ember.computed('matchingUsers', 'mergedCurrentUsers', function() {
    return this.get('matchingUsers').removeObjects(this.get('mergedCurrentUsers'));
  }),
  matchingGroups: Ember.computed('searchTermGroup', function() {
    const searchTerm = this.get('searchTermGroup').toLowerCase();
    console.log(searchTerm);
    const currentUser = this.get('user').get('currentUser');
    return currentUser.get('groupsMember').filter(function(group) {
      return group.get('name').toLowerCase().indexOf(searchTerm) !== -1;
    });
  }),


  //get everything ready for UI sharing area
  // matchingUsersSortOptions: ['firstName'],
  // combinedUsersSortOptions: ['fullName'],
  // filteredMatchingUsers: Ember.computed.sort('matchingUsers', 'matchingUsersSortOptions'),
  // filteredCombinedUsers: Ember.computed.sort('combinedUsers', 'combinedUsersSortOptions'),
  combinedReader: Ember.computed('model.clause.canReadUsers', 'model.clause.canReadGroups', function(){
    const users = this.get('model.clause.canReadUsers');
    const groups = this.get('model.clause.canReadGroups');
    let result = [];
    users.forEach((user) => {
      const userObject = {user: true, name: user.get('fullName'), object: user};
      result.pushObject(userObject);
    });
    groups.forEach((group) => {
      const groupObject = {group: true, name: group.get('name'), object: group};
      result.pushObject(groupObject);
    });
    return result;
  }),
  combinedEditors: Ember.computed('model.clause.canWriteUsers', 'model.clause.canWriteGroups', function(){
    const users = this.get('model.clause.canWriteUsers');
    const groups = this.get('model.clause.canWriteGroups');
    let result = [];
    users.forEach((user) => {
      const userObject = {user: true, name: user.get('fullName'), object: user};
      result.pushObject(userObject);
    });
    groups.forEach((group) => {
      const groupObject = {group: true, name: group.get('name'), object: group};
      result.pushObject(groupObject);
    });
    return result;
  }),



  actions: {
    readOverAction() {
      this.set('readOverTarget', true);
    },
    readDragOutAction() {
      this.set('readOverTarget', false);
    },
    writeOverAction() {
      this.set('writeOverTarget', true);
    },
    writeDragOutAction() {
      this.set('writeOverTarget', false);
    },
    adminOverAction() {
      this.set('adminOverTarget', true);
    },
    adminDragOutAction() {
      this.set('adminOverTarget', false);
    },
    addUser(user) {
      let clause = this.get('model.clause');
      user.get('canReadClauses').pushObject(clause);
      clause.save().then(() => {
        user.save();
        this.set('searchTermPeople', null);
      });
    },
    setCanWrite(editor) {
      let clause = this.get('model.clause');
      if (editor.user) {
        clause.get('canReadUsers').removeObject(editor.object);
        clause.get('adminUsers').removeObject(editor.object);
        clause.get('canWriteUsers').pushObject(editor.object);
        clause.save().then(() => {
          editor.object.save();
        });
      } else if (editor.group) {
        clause.get('canReadGroups').removeObject(editor.object);
        clause.get('adminGroups').removeObject(editor.object);
        clause.get('canWriteGroups').pushObject(editor.object);
        clause.save().then(() => {
          editor.object.save();
        });
      }

    },
    setCanRead(reader) {
      let clause = this.get('model.clause');
      if (reader.user) {
        clause.get('canWriteUsers').removeObject(reader.object);
        clause.get('adminUsers').removeObject(reader.object);
        clause.get('canReadUsers').pushObject(reader.object);
        clause.save().then(() => {
          reader.object.save();
        });
      } else if (reader.group) {
        clause.get('canWriteGroups').removeObject(reader.object);
        clause.get('adminGroups').removeObject(reader.object);
        clause.get('canReadGroups').pushObject(reader.object);
        clause.save().then(() => {
          reader.object.save();
        });
      }
    },
    setAdminUser(user) {
      let clause = this.get('model.clause');
      clause.get('canReadUsers').removeObject(user);
      clause.get('canWriteUsers').removeObject(user);
      clause.get('adminUsers').pushObject(user);
      clause.save().then(() => {
        user.save();
      });
    },
    removeCanRead(reader) {
      let clause = this.get('model.clause');
      if (reader.user) {
        clause.get('canReadUsers').removeObject(reader.object);
        clause.save().then(() => {
          reader.object.save();
        });
      } else if (reader.group) {
        clause.get('canReadGroups').removeObject(reader.object);
        clause.save().then(() => {
          reader.object.save();
        });
      }

    },
    removeCanWriteUser(user) {
      let clause = this.get('model.clause');
      clause.get('canWriteUsers').removeObject(user);
      clause.save().then(() => {
        user.save();
      });
    },
    removeAdminUser(user) {
      let clause = this.get('model.clause');
      clause.get('adminUsers').removeObject(user);
      clause.save().then(() => {
        user.save();
      });
    },
    addGroup(group) {
      let clause = this.get('model.clause');
      group.get('canReadClauses').pushObject(clause);
      clause.save().then(() => {
        group.save();
        this.set('searchTermGroup', null);
      });
    },
    openEdit() {
      this.set('isEditing', true);
      this.resetClauseData();
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
      this.saveClauseData();
    },
    closeSearch() {
      this.set('searchTermPeople', null);
      this.set('searchTermGroup', null);
    },
    confirmDelete() {
      this.set('confirmDelete', true);
    },
    cancelDelete() {
      this.set('confirmDelete', false);
    },
    destroyClause() {
      let users = this.get('mergedCurrentUsers');
      let clause = this.get('model.clause');
      let tags = this.get('model.clause.tags');
      this.get('model.clause.blocks').then((blocks) => {
        blocks.forEach((block) => {
          block.destroyRecord();
        });
      }).then(() => {
        clause.deleteRecord();
        users.forEach((user) => {
          user.save();
        });
        tags.forEach((tag) => {
          tag.save();
        });
      }).then(() => {
        clause.save().then(() => {
          this.transitionToRoute('library');
        });
      });
    },

  }


});
