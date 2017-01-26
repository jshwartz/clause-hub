import DS from 'ember-data';
import Ember from 'ember';


export default DS.Model.extend({
  dropdowns: DS.attr({ defaultValue: () => [] }),
  checkboxes: DS.attr({ defaultValue: () => [
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
  checkboxChoices: DS.attr({ defaultValue: () => [
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
  paragraph: Ember.computed.equal('type', 'paragraph'),
  defaultText: Ember.computed('dropdowns', 'defaultTrue', 'checkboxes', function(){
    let returnText = null;
    if (this.get('type') === 'dropdown' && this.get('dropdowns')) {
      this.get('dropdowns').forEach( (dropdown) => {
        const dropdownDefault = dropdown.defaultTrue;
        const dropdownText = dropdown.text;
        if (dropdownDefault) {
          returnText = dropdownText;
        }
      });
    } else if (this.get('type') === 'static') {
      returnText = this.get('staticText');
    } else if (this.get('type') === 'toggle' ) {
      if (this.get('defaultTrue')) {
        returnText = this.get('staticText');
      } else {
        returnText = null;
      }
    } else if (this.get('type') === 'checkbox') {
      let selected = null;
      let selectedArray = [];
      this.get('checkboxes').forEach( (checkbox) => {
        if (checkbox.defaultTrue) {
          selectedArray.push(checkbox.orderNumber);
        }
      });
      selected = parseInt(selectedArray.sort().join(""));
      if (isNaN(selected)) {
        selected = 0;
      }
      this.get('checkboxChoices').forEach( (choice) => {
        if (selected === choice.checkboxes) {
          returnText = choice.text;
        }
      });
    }
    return returnText;
  }),
  selectedText: Ember.computed('selected', 'staticText', function(){
    let returnText = null;
    if (this.get('type') === 'dropdown' && this.get('dropdowns')) {
      this.get('dropdowns').find( (dropdown) => {
        const dropdownSelected = dropdown.selected;
        const dropdownText = dropdown.text;
        if (dropdownSelected) {
          returnText = dropdownText;
        }
      });
    } else if (this.get('type') === 'static') {
      returnText = this.get('staticText');
    } else if (this.get('type') === 'toggle' ) {
      if (this.get('selected')) {
        returnText = this.get('staticText');
      } else {
        returnText = null;
      }
    } else if (this.get('type') === 'checkbox') {
      let selected = null;
      let selectedArray = [];
      this.get('checkboxes').find( (checkbox) => {
        if (checkbox.selected) {
          selectedArray.push(checkbox.orderNumber);
        }
      });
      selected = parseInt(selectedArray.sort().join(""));
      if (isNaN(selected)) {
        selected = 0;
      }
      this.get('checkboxChoices').find( (choice) => {
        if (selected === choice.checkboxes) {
          returnText = choice.text;
        }
      });
    } else if (this.get('type') === 'paragraph') {
        returnText = this.get('staticText');
    }
    return returnText;
  }),



});
