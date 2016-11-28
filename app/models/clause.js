import DS from 'ember-data';

export default DS.Model.extend({
  blocks: DS.hasMany('block'),
  tags: DS.hasMany('tag'),
  name: DS.attr('string'),
  title: DS.attr('string'),
  createdAt: DS.attr('date', {
    defaultValue() { return new Date(); }
  }),
  type: DS.attr('string'),
  createdBy: DS.attr('string'),
  lastUpdatedBy: DS.attr('string'),
  readmeMD: DS.attr('string'),

});
