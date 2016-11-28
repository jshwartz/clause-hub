import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  color: DS.attr('string'),
  clauses: DS.hasMany('clause'),
  createdAt: DS.attr('date', {
    defaultValue() { return new Date(); }
  }),

});
