import DS from 'ember-data';

export default DS.Model.extend({
  dropdowns: DS.attr({ defaultValue: [] }),
  checkboxes: DS.attr({ defaultValue: [
    {
      active: false,
      defaultTrue: false,
      orderNumber: 1,
      selected: false,
      menuText: "Option 1"
    },{
      active: false,
      defaultTrue: false,
      orderNumber: 2,
      selected: false,
      menuText: "Option 2"
    },{
      active: false,
      defaultTrue: false,
      orderNumber: 3,
      selected: false,
      menuText: "Option 3"
    }
  ] }),
  checkboxChoices: DS.attr({ defaultValue: [
    {
      active: true,
      defaultTrue: true,
      checkboxes: 0,
      formText: [],
      text: "Hi, I'm the text that will display when no checkboxes are selected.",
    },{
      active: false,
      defaultTrue: false,
      checkboxes: 1,
      formText: ["Option 1"],
      text: "Hi, I'm the text that will display when only checkbox 1 is selected.",
    },{
      active: false,
      defaultTrue: false,
      checkboxes: 2,
      formText: ["Option 2"],
      text: "Hi, I'm the text that will display when only checkbox 2 is selected.",
    },{
      active: false,
      defaultTrue: false,
      checkboxes: 3,
      formText: ["Option 3"],
      text: "Hi, I'm the text that will display when only checkbox 3 is selected.",
    },{
      active: false,
      defaultTrue: false,
      checkboxes: 12,
      formText: ["Option 1", "Option 2"],
      text: "Hi, I'm the text that will display when only checkbox 1 and 2 is selected.",
    },{
      active: false,
      defaultTrue: false,
      checkboxes: 13,
      formText: ["Option 1", "Option 3"],
      text: "Hi, I'm the text that will display when only checkbox 1 and 3 is selected.",
    },{
      active: false,
      defaultTrue: false,
      checkboxes: 23,
      formText: ["Option 2", "Option 3"],
      text: "Hi, I'm the text that will display when only checkbox 2 and 3 is selected.",
    },{
      active: false,
      defaultTrue: false,
      checkboxes: 123,
      formText: ["Option 1", "Option 2", "Option 3"],
      text: "Hi, I'm the text that will display when all three checkboxes are selected.",
    }
  ] }),
  title: DS.attr('string'),
  clause: DS.belongsTo('clause', {
    inverse: 'blocks'
  }),
  type: DS.attr('string'),
  orderNumber: DS.attr('number'),
  staticText: DS.attr('string'),
  toggleMenuText: DS.attr('string'),
  defaultTrue: DS.attr('boolean'),
  selected: DS.attr('boolean'),
  helpText: DS.attr('string'),
  blockDropdowns: DS.hasMany('block-dropdown'),
  blockCheckboxes: DS.hasMany('block-checkbox'),
  blockCheckboxChoices: DS.hasMany('block-checkbox-choice'),

});
