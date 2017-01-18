import DS from 'ember-data';

export default DS.Model.extend({
  clauses: DS.hasMany('clause'),
  members: DS.hasMany('user', {
    inverse: 'groupsMember'
  }),
  managers: DS.hasMany('user', {
    inverse: 'groupsManager'
  }),
  canWriteClauses: DS.hasMany('clause', {
    inverse: 'canWriteGroups'
  }),
  canReadClauses: DS.hasMany('clause', {
    inverse: 'canReadGroups'
  }),
  adminClauses: DS.hasMany('clause', {
    inverse: 'adminGroups'
  }),
  ownerClauses: DS.hasMany('clause', {inverse: 'ownerGroup'}),
  name: DS.attr('string'),
  description: DS.attr('string'),
  createdBy: DS.belongsTo('user'),
  createdAt: DS.attr('date'),
  lastModified: DS.attr('date'),
  lastModifiedBy:DS.belongsTo('user'),
});
