import Ember from 'ember';

export default Ember.Controller.extend({
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
  matchingUsersSortOptions: ['firstName'],
  combinedUsersSortOptions: ['fullName'],
  filteredMatchingUsers: Ember.computed.sort('matchingUsers', 'matchingUsersSortOptions'),
  filteredCombinedUsers: Ember.computed.sort('combinedUsers', 'combinedUsersSortOptions'),
  combinedUsers: Ember.computed('model.clause.canReadUsers', 'model.clause.canWriteUsers', 'model.clause.adminUsers', function() {
    const canReadUsers = this.get('model.clause.canReadUsers');
    const canWriteUsers = this.get('model.clause.canWriteUsers');
    const adminUsers = this.get('model.clause.adminUsers');
    const adminUsersLength = adminUsers.get('length');
    let returnArray = [];
    canWriteUsers.forEach((writeUser) => {
      const writeUserObject = {fullName: writeUser.get('fullName'), company: writeUser.get('company'), canRead: true, canWrite: true, admin: false, id: writeUser.get('id')};
      returnArray.pushObject(writeUserObject);
    });
    canReadUsers.forEach((readUser) => {
      const readUserObject = {fullName: readUser.get('fullName'), company: readUser.get('company'), canRead: true, canWrite: false, admin: false, id: readUser.get('id')};
      returnArray.pushObject(readUserObject);
    });
    adminUsers.forEach((adminUser) => {
      if (adminUsersLength > 1) {
        const adminUserObject = {fullName: adminUser.get('fullName'), company: adminUser.get('company'), canRead: true, canWrite: true, admin: true, id: adminUser.get('id')};
        returnArray.pushObject(adminUserObject);
      } else {
        const adminUserObject = {fullName: adminUser.get('fullName'), company: adminUser.get('company'), canRead: true, canWrite: true, admin: true, singleAdmin: true, id: adminUser.get('id')};
        returnArray.pushObject(adminUserObject);
      }
    });

    return returnArray;
  }),

  actions: {
    addUser(user) {
      let clause = this.get('model.clause');
      user.get('canReadClauses').pushObject(clause);
      clause.save().then(() => {
        user.save();
        this.set('searchTerm', null);
      });
    },
    setCanWriteUser(userObject) {
      let clause = this.get('model.clause');
      this.get('store').findRecord('user', userObject.id).then((user) => {
        clause.get('canReadUsers').removeObject(user);
        clause.get('adminUsers').removeObject(user);
        clause.get('canWriteUsers').pushObject(user);
        clause.save().then(() => {
          user.save();
        });
      });
    },
    setCanReadUser(userObject) {
      let clause = this.get('model.clause');
      this.get('store').findRecord('user', userObject.id).then((user) => {
        clause.get('canWriteUsers').removeObject(user);
        clause.get('adminUsers').removeObject(user);
        clause.get('canReadUsers').pushObject(user);
        clause.save().then(() => {
          user.save();
        });
      });
    },
    setAdminUser(userObject) {
      let clause = this.get('model.clause');
      this.get('store').findRecord('user', userObject.id).then((user) => {
        clause.get('canReadUsers').removeObject(user);
        clause.get('canWriteUsers').removeObject(user);
        clause.get('adminUsers').pushObject(user);
        clause.save().then(() => {
          user.save();
        });
      });
    },
    removeCanReadUser(userObject) {
      let clause = this.get('model.clause');
      this.get('store').findRecord('user', userObject.id).then((user) => {
        clause.get('canWriteUsers').removeObject(user);
        clause.get('adminUsers').removeObject(user);
        clause.get('canReadUsers').removeObject(user);
        clause.save().then(() => {
          user.save();
        });
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
      this.set('searchTerm', null);
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
