import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  text: DS.attr('string'),
  orderNumber: DS.attr('number'),
  subSections: DS.hasMany('section', { inverse: 'section' }),
  section: DS.belongsTo('section', { inverse: 'subSections' }),
  ctemplate: DS.belongsTo('ctemplate', { inverse: 'csections' }),
  ctemplateRef: DS.belongsTo('ctemplate', { inverse: 'csectionsRef' }),
  toggledOn: DS.attr('boolean'),
  mergeField: DS.attr('string'),
  mergeTest: Ember.computed('text', 'ctemplateRef.mergeFields.@each.mergeValue', function() {
    const mergeFields = this.get('ctemplateRef.mergeFields');
    if (mergeFields && this.get('text')) {
      let text = this.get('text');
      mergeFields.forEach((field) => {
        text = text.replace(field.name, "<span class='focusedTerm'>" + field.mergeValue + "</span>");
      });
      return text;
    }
  }),

});
