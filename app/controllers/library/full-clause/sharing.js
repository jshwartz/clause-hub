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
    const metadata = this.get('model.metadata');
    this.set('titleText', metadata.title);
    this.set('subtitleText', metadata.subTitle);
    this.set('headerText', metadata.header);
    this.set('errors.title', null);
    this.set('errors.subtitle', null);
    this.set('errorMessage', null);
  },
  saveClauseData() {
    const clause = this.get('model');
    clause.set('metadata.title', this.get('titleText'));
    clause.set('metadata.subTitle', this.get('subtitleText'));
    clause.set('metadata.header', this.get('headerText'));
    this.get('model').save().then(() => {
      this.set('isEditing', false);
    });
  },
  validate() {
    this.set('errors.title', this.get('titleTextNotEmpty') ? null : "Title required");
    this.set('errors.subtitle', this.get('subtitleTextNotEmpty') ? null : "Subtitle required.");
  },


  onlyOneAdmin: Ember.computed('model.adminUsers', 'model.adminGroups', function() {
    if (this.get('model.adminUsers.length') + this.get('model.adminGroups.length')  < 2) {
      return true;
    } else {
      return false;
    }
  }),

  //search stuff
  init() {
    this.get('store').findAll('user').then((users) =>{
      this.set('users', users);
    });
  },
  users: null,
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
    return this.get('users').filter(function(user) {
      return user.get('fullName').toLowerCase().indexOf(searchTerm) !== -1;
    });
  }),
  mergedCurrentUsers: Ember.computed.union('model.canReadUsers', 'model.canWriteUsers', 'model.adminUsers'),
  matchingNoCurrentUsers: Ember.computed('matchingUsers', 'mergedCurrentUsers', function() {
    return this.get('matchingUsers').removeObjects(this.get('mergedCurrentUsers'));
  }),
  matchingGroups: Ember.computed('searchTermGroup', function() {
    const searchTerm = this.get('searchTermGroup').toLowerCase();
    const currentUser = this.get('user').get('currentUser');
    return currentUser.get('groupsMember').filter(function(group) {
      return group.get('name').toLowerCase().indexOf(searchTerm) !== -1;
    });
  }),

  //search stuff for owners
  matchingOwnerUsers: Ember.computed('searchTermPeople', function() {
    var searchTerm = this.get('searchTermPeople').toLowerCase();
    return this.get('users').filter(function(user) {
      return user.get('fullName').toLowerCase().indexOf(searchTerm) !== -1;
    });
  }),


  //get everything ready for UI sharing area
  // matchingUsersSortOptions: ['firstName'],
  // combinedUsersSortOptions: ['fullName'],
  // filteredMatchingUsers: Ember.computed.sort('matchingUsers', 'matchingUsersSortOptions'),
  // filteredCombinedUsers: Ember.computed.sort('combinedUsers', 'combinedUsersSortOptions'),
  combinedReader: Ember.computed('model.canReadUsers', 'model.canReadGroups', function(){
    const users = this.get('model.canReadUsers');
    const groups = this.get('model.canReadGroups');
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
  combinedEditors: Ember.computed('model.canWriteUsers', 'model.canWriteGroups', function(){
    const users = this.get('model.canWriteUsers');
    const groups = this.get('model.canWriteGroups');
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
  combinedAdmins: Ember.computed('model.adminUsers', 'model.adminGroups', function(){
    const users = this.get('model.adminUsers');
    const groups = this.get('model.adminGroups');
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
      let clause = this.get('model');
      user.get('canReadClauses').pushObject(clause);
      clause.save().then(() => {
        user.save();
        this.set('searchTermPeople', null);
      });
    },
    setCanWrite(editor) {
      let clause = this.get('model');
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
      let clause = this.get('model');
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
    setAdmin(admin) {
      let clause = this.get('model');
      if (admin.user) {
        clause.get('canReadUsers').removeObject(admin.object);
        clause.get('canWriteUsers').removeObject(admin.object);
        clause.get('adminUsers').pushObject(admin.object);
        clause.save().then(() => {
          admin.object.save();
        });
      } else if (admin.group) {
        clause.get('canReadGroups').removeObject(admin.object);
        clause.get('canWriteGroups').removeObject(admin.object);
        clause.get('adminGroups').pushObject(admin.object);
        clause.save().then(() => {
          admin.object.save();
        });
      }
    },
    removeCanRead(reader) {
      let clause = this.get('model');
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
    removeCanWrite(editor) {
      let clause = this.get('model');
      if (editor.user) {
        clause.get('canWriteUsers').removeObject(editor.object);
        clause.save().then(() => {
          editor.object.save();
        });
      } else if (editor.group) {
        clause.get('canWriteGroups').removeObject(editor.object);
        clause.save().then(() => {
          editor.object.save();
        });
      }
    },
    removeAdmin(admin) {
      let clause = this.get('model');
      if (admin.user) {
        clause.get('adminUsers').removeObject(admin.object);
        clause.save().then(() => {
          admin.object.save();
        });
      } else if (admin.group) {
        clause.get('adminGroups').removeObject(admin.object);
        clause.save().then(() => {
          admin.object.save();
        });
      }
    },
    addGroup(group) {
      let clause = this.get('model');
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
      let clause = this.get('model');
      let tags = this.get('model.tags');
      this.get('model.blocks').then((blocks) => {
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
    openTransferOwnership() {
      $('.ui.transfer-owner.modal').modal('show');
    },
    selectTransferUser(user) {
      this.set('selectedUser', user);
      this.set('activateTransferButton', true);
      this.set('selectedGroup', null);
      this.set('searchTermGroup', null);
    },
    selectTransferGroup(group) {
      this.set('selectedUser', null);
      this.set('activateTransferButton', true);
      this.set('selectedGroup', group);
      this.set('searchTermGroup', null);
    },
    cancelTransfer() {
      this.set('selectedUser', null);
      this.set('selectedGroup', null);
      this.set('activateTransferButton', false);
    },
    transferOwnershipUser() {
      let newUserOwner = this.get('selectedUser');
      let newGroupOwner = this.get('selectedGroup');
      if (newUserOwner) {
        this.get('model.ownerUser').then((currentUserOwner) => {
          this.set('model.ownerUser', newUserOwner);
          this.set('model.ownerGroup', null);
          this.get('model').save().then(() => {
            newUserOwner.save();
            currentUserOwner.save();
            $('.ui.transfer-owner.modal').modal('hide');
          });
        });
      } else if (newGroupOwner) {
        this.get('model.ownerUser').then((currentUserOwner) => {
          this.set('model.ownerUser', null);
          this.set('model.ownerGroup', newGroupOwner);
          this.get('model').save().then(() => {
            newGroupOwner.save();
            currentUserOwner.save();
            $('.ui.transfer-owner.modal').modal('hide');
          });
        });
      }
    },
    transferOwnershipGroup() {
      let newUserOwner = this.get('selectedUser');
      let newGroupOwner = this.get('selectedGroup');
      if (newUserOwner) {
        this.get('model.ownerGroup').then((currentUserGroup) => {
          this.set('model.ownerUser', newUserOwner);
          this.set('model.ownerGroup', null);
          this.get('model').save().then(() => {
            newUserOwner.save();
            currentUserGroup.save();
            $('.ui.transfer-owner.modal').modal('hide');
          });
        });
      } else if (newGroupOwner) {
        this.get('model.ownerGroup').then((currentUserGroup) => {
          this.set('model.ownerUser', null);
          this.set('model.ownerGroup', newGroupOwner);
          this.get('model').save().then(() => {
            newGroupOwner.save();
            currentUserGroup.save();
            $('.ui.transfer-owner.modal').modal('hide');
          });
        });
      }
    },

  }


});
