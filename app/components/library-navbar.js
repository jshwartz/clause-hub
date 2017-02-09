import Ember from 'ember';
import { PerfectScrollbarMixin } from 'ember-perfect-scrollbar';

export default Ember.Component.extend(PerfectScrollbarMixin, {
  classNameBindings: ["librarynavactive", "librarynavhide"],
  librarynavactive:  Ember.computed.equal('librarySidenavActive', true),
  librarynavhide: Ember.computed.equal('librarySidenavActive', false),
  //get clauses ready
  combinedClauses: Ember.computed.union('model.clauses'),
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
  // favoriteFilter: false,
  // favoriteClauses: Ember.computed('favoriteFilter', 'model.favoriteClauses', 'model.clauses', function() {
  //   if (this.get('favoriteFilter')) {
  //     return this.get('model.favoriteClauses');
  //   } else {
  //     return this.get('combinedClauses');
  //   }
  // }),
  dateFilterOptions: [
    {title: 'No Date Filter', value: null},
    {title: 'Updated Last 30 Days', value: "u30d"},
    {title: 'Updated Last 6 Months', value: "u6m"},
    {title: 'Updated Last Year', value: "u1y"},
  ],
  filteredClauses: Ember.computed('dateFilter', 'model.clauses', function() {
    // if (this.get('dateFilter') === "u30d") {
    //   return this.get('updatedLastMonth');
    // } else if (this.get('dateFilter') === "u6m") {
    //   return this.get('updatedLast6Months');
    // } else if (this.get('dateFilter') === "u1y") {
    //   return this.get('updatedLastYear');
    // } else {
      return this.get('model.clauses');
    // }
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

});
