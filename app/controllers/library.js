import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  //services
  user: Ember.inject.service(),
  //options and tag menu
  librarySidenavActive: true,
  headerColor: "blue-header",
  optionsOpen: true,
  searchMenu: true,
  tagMenu: false,
  title: null,
  hasValidTitle: Ember.computed.notEmpty('title'),
  subTitle: null,
  hasValidSubTitle: Ember.computed.notEmpty('subTitle'),
  heading: null,
  hasErrors: Ember.computed('hasValidTitle', 'hasValidSubTitle', function() {
    const hasValidTitle = this.get('hasValidTitle');
    const hasValidSubTitle = this.get('hasValidSubTitle');
    if (hasValidTitle && hasValidSubTitle) {
      return false;
    } else {
      return true;
    }
  }),
  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),

  validate() {
    this.set('errors.subTitle', this.get('hasValidSubTitle') ? null : "Sub-title is required.");
    this.set('errors.title', this.get('hasValidTitle') ? null : "Title is required.");
  },
  resetModal() {
    this.setProperties({ title: null, subTitle: null, heading: null, errorMessage: false});
    this.errors.setProperties({title: null, subTitle: null});
  },

  actions: {
    toggleLibSidebar() {
      this.toggleProperty('librarySidenavActive');
    },
    closeLibSidebar() {
      this.set('librarySidenavActive', false);
    },
    toggle() {
      console.log('hi');
      $('#sub-sidebar')
        .sidebar('setting', 'transition', 'push')
        .sidebar('toggle')
      ;
    },
    openSearchMenu() {
      this.set('searchMenu', true);
      this.set('tagMenu', false);
    },
    openTagMenu() {
      this.set('searchMenu', false);
      this.set('tagMenu', true);
    },
    cancelNewClause() {
      this.resetModal();
    },
    createClause() {
      this.set('clauseIsSaving', true);
      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        this.set('clauseIsSaving', false);
        return false;
      }
      const metadata = {
        title: this.get('title'),
        subTitle: this.get('subTitle'),
        header: this.get('heading'),
        createdAt: new Date(),
        lastModified: new Date(),
        lastModifiedBy: this.get('model.fullName'),
        createdBy: this.get('model.fullName'),
      };
      this.get('store').findRecord('user', this.get('session.currentUser.uid')).then((admin) => {
        const newClause = this.get('store').createRecord('clause', {
          metadata: metadata,
        });
        newClause.get('adminUsers').pushObject(admin);
        newClause.save()
          .then(() => {
            admin.save();
            this.set('clauseIsSaving', false);
            this.transitionToRoute('library.fullClause.builder', newClause);
          })
          .catch(error => {
            console.error("Error saving player", error);
          });
      });
    },
    openClauseModal() {
      $('.ui.clause.modal').modal('show');
    },
    updateClauseFavorite(clause) {
      this.get('user.currentUser').then((user) => {
        if (clause.get('favoriteTrue')) {
          console.log(true);
          clause.get('favoriteUsers').removeObject(user);
          clause.save().then(() => {
            user.save();
          });
        } else if (!clause.get('favoriteTrue')) {
          console.log(false);
          clause.get('favoriteUsers').pushObject(user);
          clause.save().then(() => {
            user.save();
          });
        }
      });
    },
    openLibraryOptions() {
      $('.ui.mobilelibrary.modal').modal('show');
    }
  }
});
