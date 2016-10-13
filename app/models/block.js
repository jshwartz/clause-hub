import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  clause: DS.belongsTo('clause'),
  type: DS.attr('string'),
  orderNumber: DS.attr('number'),
  staticText: DS.attr('string'),
  toggleMenuText: DS.attr('string'),
  toggleDefault: DS.attr('boolean'),
  helpText: DS.attr('string'),
  blockDropdowns: DS.hasMany('block-dropdown'),

});
