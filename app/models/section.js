import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  idAnchor: Ember.computed('id', function() {
    const id = this.get('id');
    return "#" + id;
  }),
  hoverHighlight: DS.attr('boolean'),
  type: DS.attr('string'),
  isStatic: Ember.computed.equal('type', 'static'),
  isToggle: Ember.computed.equal('type', 'toggle'),
  isDropdown: Ember.computed.equal('type', 'dropdown'),
  text: DS.attr('string'),
  textTemp: DS.attr('string'),
  header: DS.attr('string'),
  headerTemp: DS.attr('string'),
  menuText: DS.attr('string'),
  menuTextTemp: DS.attr('string'),
  orderNumber: DS.attr('number'),
  subSections: DS.hasMany('section', { inverse: 'section' }),
  section: DS.belongsTo('section', { inverse: 'subSections' }),
  nextSection:DS.belongsTo('section', { inverse: 'priorSection' }),
  priorSection:DS.belongsTo('section', { inverse: 'nextSection' }),
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
