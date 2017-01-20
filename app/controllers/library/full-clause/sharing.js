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
    this.get('store').findAll('library').then((libraries) => {
      this.set('libraries', libraries);
    });
  },
  libraries: null,
  searchTerm: '',
  searchTermNotEmpty: Ember.computed.notEmpty('searchTerm'),
  matchingLibraries: Ember.computed('searchTerm', function() {
    var searchTerm = this.get('searchTerm').toLowerCase();
    return this.get('libraries').filter(function(library) {
      return library.get('name').toLowerCase().indexOf(searchTerm) !== -1;
    });
  }),
  newlib: null,

  actions: {
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
    selectTransferLibrary(selectedlib) {
      this.set('newlib', selectedlib);
      console.log(this.get('newlib'));
      this.set('activateTransferButton', true);
      this.set('searchTerm', null);
    },
    cancelTransfer() {
      this.set('newlib', null);
      this.set('activateTransferButton', false);
    },
    transferLibrary() {
      const newlib = this.get('newlib');
      const clause = this.get('model');
      this.get('model.library').then((oldlib) => {
        clause.set('library', newlib);
        newlib.save().then(() => {
          clause.save();
          oldlib.save();
          $('.ui.transfer-owner.modal').modal('hide');
        });
      });
    },

  }


});
