import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  csections: DS.hasMany('section', { inverse: 'ctemplate'}),
  sortBy: DS.attr('', { defaultValue: ['orderNumber'] }),
  sortedSections: Ember.computed.sort('csections', 'sortBy'),
  csectionsRef: DS.hasMany('section', { inverse: 'ctemplateRef'}),
  sortedSectionsRef: Ember.computed.sort('csectionsRef', 'sortBy'),
  text: DS.attr(''),
  mergeFieldSelected: DS.attr(''),
  mergeFields: DS.attr(''),
});
