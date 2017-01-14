import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  group: DS.belongsTo('group'),
  clauses: DS.hasMany('clause'),
  baseFolder: DS.attr('boolean'),
  parent: DS.belongsTo('folder', { inverse: 'children' }),
  children: DS.hasMany('folder', { inverse: 'parent' }),
  name: DS.attr('string'),



});
