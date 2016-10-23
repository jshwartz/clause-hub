import DS from 'ember-data';

export default DS.Model.extend({
  block: DS.belongsTo('block'),
  text: DS.attr('string'),
  formText: DS.attr(),
  checkboxes: DS.attr('number'),
  defaultTrue: DS.attr('boolean'),
});
