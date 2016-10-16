import DS from 'ember-data';

export default DS.Model.extend({
  block: DS.belongsTo('block'),
  menuText: DS.attr('string'),
  orderNumber: DS.attr('number'),
  selected: DS.attr('boolean'),
});
