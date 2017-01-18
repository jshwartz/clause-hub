import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  firstName: DS.attr(),
  lastName: DS.attr(),
  email: DS.attr(),
  company: DS.attr('string'),
  favoriteClauses: DS.hasMany('clause', {inverse: 'favoriteUsers'}),
  canWriteClauses: DS.hasMany('clause', {inverse: 'canWriteUsers'}),
  canReadClauses: DS.hasMany('clause', {inverse: 'canReadUsers'}),
  adminClauses: DS.hasMany('clause', {inverse: 'adminUsers'}),
  ownerClauses: DS.hasMany('clause', {inverse: 'ownerUser'}),
  groupsMember: DS.hasMany('group', {inverse: 'members'}),
  groupsManager: DS.hasMany('group', {inverse: 'managers'}),
  subFolders: DS.hasMany('folder', {inverse: 'user'}),
  baseFolder: DS.belongsTo('folder', {inverse: null}),
  admin: DS.attr('boolean', { defaultValue: false }),
  verified: DS.attr('boolean', { defaultValue: false }),
  createdAt: DS.attr('date', {defaultValue() {
    return new Date();
  }  }),
  fullName: Ember.computed('firstName', 'lastName', function() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }),
});
