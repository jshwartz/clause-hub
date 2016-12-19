import DS from 'ember-data';

export default DS.Model.extend({
  metadata: DS.attr(),
  blocks: DS.hasMany('block', {
    inverse: 'clause'
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
  name: DS.attr('string'),
  title: DS.attr('string'),
  createdAt: DS.attr('date', {
    defaultValue() { return new Date(); }
  }),
  type: DS.attr('string'),
  createdBy: DS.attr('string'),
  lastUpdatedBy: DS.attr('string'),
  readme: DS.attr('string'),

});
