import DS from 'ember-data';

export default DS.Model.extend({
  csections: DS.hasMany('section', { inverse: 'ctemplate'}),
  csectionsRef: DS.hasMany('section', { inverse: 'ctemplateRef'}),
  text: DS.attr(''),
  mergeFieldSelected: DS.attr(''),
  mergeFields: DS.attr(''),
});
