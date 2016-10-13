import DS from 'ember-data';

export default DS.Model.extend({
  block: DS.belongsTo('block'),
  defaultTrue: DS.attr('boolean'),
  menuText: DS.attr('string'),
  orderNumber: DS.attr('number'),
  text: DS.attr('string'),
});
