import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  clauses: DS.hasMany('clause'),
  owner: DS.belongsTo('user', {inverse: 'personalLibrary'}),
  managers: DS.hasMany('user', {inverse: 'librariesManager'}),
  members: DS.hasMany('user', {inverse: 'librariesMember'}),
  editors: DS.hasMany('user', {inverse: 'librariesEditor'}),
  approvers: DS.hasMany('user', {inverse: 'librariesApprover'}),
  name: DS.attr('string'),
  createdBy: DS.belongsTo('user'),
  createdAt: DS.attr('date', {defaultValue() { return new Date(); } }),
  lastModified: DS.attr('date', {defaultValue() { return new Date(); } }),
  lastModifiedBy:DS.belongsTo('user'),
});
