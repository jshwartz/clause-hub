import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  session: Ember.inject.service(),
  // lastModified: DS.attr('date'),
  metadata: DS.attr(),
  blocks: DS.hasMany('block', {
    inverse: 'clause'
  }),
  favoriteUsers: DS.hasMany('user', {
    inverse: 'favoriteClauses'
  }),
  favoriteTrue: Ember.computed('favoriteUsers', function() {
    let result = false;
    this.get('favoriteUsers').forEach((user) => {
      if (user.get('id') === this.get('session.currentUser.uid') ) {
        result = true;
      }
    });
    return result;
  }),
  tags: DS.hasMany('tag'),
  canWriteUsers: DS.hasMany('user', {
    inverse: 'canWriteClauses'
  }),
  canReadUsers: DS.hasMany('user', {
    inverse: 'canReadClauses'
  }),
  adminUsers: DS.hasMany('user', {
    inverse: 'adminClauses'
  }),
  owner: DS.belongsTo('user', {
    inverse: 'ownsClauses'
  }),
  // name: DS.attr('string'),
  // title: DS.attr('string'),
  // createdAt: DS.attr('date', {
  //   defaultValue() { return new Date(); }
  // }),
  type: DS.attr('string'),
  // createdBy: DS.attr('string'),
  // lastUpdatedBy: DS.attr('string'),
  readme: DS.attr('string'),
});
