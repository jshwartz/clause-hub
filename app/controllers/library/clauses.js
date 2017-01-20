import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  //services
  user: Ember.inject.service(),
  //options and tag menu
  searchMenu: true,
  tagMenu: false,
  //get clauses ready
  combinedClauses: Ember.computed.union('model.adminClauses', 'model.canReadClauses', 'model.canWriteClauses'),
  queryParams: {sortBy: 'sortBy', direction: 'direction', dateFilter: 'date', favoriteFilter: 'favorites', search: 's'},
  //search time
  search: null,
  searchedClauses: Ember.computed('search', 'sortedClauses', function() {
    if (this.get('search')) {
      const search = this.get('search').toLowerCase();
      return this.get('sortedClauses').filter(function(clause) {
        return clause.get('metadata.title').toLowerCase().indexOf(search) !== -1;
      });
    } else {
      return this.get('sortedClauses');
    }
  }),
  //clause sorting time
  sortBy: 'metadata.title',
  direction: 'asc',
  sortProperties: Ember.computed('sortBy', 'direction', function() {
    const sortBy = this.get('sortBy');
    const direction = this.get('direction');
    return [sortBy + ':' + direction];
  }),
  sortedClauses: Ember.computed.sort('filteredClauses', 'sortProperties'),
  sortOptions: [
    {title: "Title", value: "metadata.title"},
    {title: "Updated", value: "metadata.lastModified"},
    {title: "Created", value: "metadata.createdAt"},
  ],
  //filter time
  dateFilter: null,
  favoriteFilter: false,
  favoriteClauses: Ember.computed('favoriteFilter', 'model.favoriteClauses', 'combinedClauses', function() {
    if (this.get('favoriteFilter')) {
      return this.get('model.favoriteClauses');
    } else {
      return this.get('combinedClauses');
    }
  }),
  dateFilterOptions: [
    {title: 'No Date Filter', value: null},
    {title: 'Updated Last 30 Days', value: "u30d"},
    {title: 'Updated Last 6 Months', value: "u6m"},
    {title: 'Updated Last Year', value: "u1y"},
  ],
  filteredClauses: Ember.computed('dateFilter', 'model.clauses', function() {
    if (this.get('dateFilter') === "u30d") {
      return this.get('updatedLastMonth');
    } else if (this.get('dateFilter') === "u6m") {
      return this.get('updatedLast6Months');
    } else if (this.get('dateFilter') === "u1y") {
      return this.get('updatedLastYear');
    } else {
      return this.get('model.clauses');
    }
  }),
  updatedLastMonth: Ember.computed.filter('model.clauses', function(clause) {
    return moment().diff(clause.get('metadata.lastModified'), 'months') < 1;
  }),
  updatedLast6Months: Ember.computed.filter('model.clauses', function(clause) {
    return moment().diff(clause.get('metadata.lastModified'), 'months') < 6;
  }),
  updatedLastYear: Ember.computed.filter('model.clauses', function(clause) {
    return moment().diff(clause.get('metadata.lastModified'), 'years') < 1;
  }),
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
