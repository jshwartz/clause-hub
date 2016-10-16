import DS from 'ember-data';

export default DS.Model.extend({
  block: DS.belongsTo('block'),
  text: DS.attr('string'),
  checkboxes: DS.attr('number'),
});
