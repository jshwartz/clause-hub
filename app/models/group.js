import DS from 'ember-data';

export default DS.Model.extend({
  clauses: DS.hasMany('clause'),
  members: DS.hasMany('user', {
    inverse: 'groupsMember'
  }),
  managers: DS.hasMany('user', {
    inverse: 'groupsManager'
  }),
  name: DS.attr('string'),
  description: DS.attr('string'),
  createdBy: DS.belongsTo('user'),
  createdAt: DS.attr('date'),
  lastModified: DS.attr('date'),
  lastModifiedBy:DS.belongsTo('user'),
});
