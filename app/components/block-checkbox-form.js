import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  errors: null,
  errorMessage: false,
  title: null,
  hasValidTitle: Ember.computed.notEmpty('title'),
  helpText: null,
  sortBy: ['orderNumber'],
  sortedCheckboxes: Ember.computed.sort('model.blockCheckboxes', 'sortBy'),
  sortChoicesBy: ['checkboxes'],
  sortedCheckboxChoices: Ember.computed.sort('model.blockCheckboxChoices', 'sortChoicesBy'),
  hasErrors: Ember.computed.not('hasValidTitle'),


  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),

  rebuildFormText() {
    let checkboxes = this.get('model.blockCheckboxes');
    let choices = this.get('model.blockCheckboxChoices');
    let checkboxArray = [];
    checkboxes.forEach((checkbox) => {
      const checkboxOrderNumber = checkbox.get('orderNumber');
      const menuText = checkbox.get('menuText');
      checkboxArray.addObject({checkboxOrderNumber: checkboxOrderNumber, menuText: menuText});
    });
    choices.forEach((choice) => {
      const checkboxString = choice.get('checkboxes').toString();
      const checkboxStringArray = checkboxString.split("");
      let formTextTemp = [];
      checkboxStringArray.forEach((valueInArray) => {
        checkboxArray.forEach((checkbox) => {
          if (checkbox.checkboxOrderNumber === parseInt(valueInArray)) {
            formTextTemp.push(checkbox.menuText);
          }
        });
      });
      console.log(formTextTemp);
      choice.set('formText', formTextTemp);
      choice.save();
    });
  },

  validate() {
    this.set('errors.title', this.get('hasValidTitle') ? null : "Menu title is required.");
  },

  resetBlockData() {
    ['title', 'helpText'].forEach((field) => {
      const valueInBlock = this.get('model').get(field);
      this.set(field, valueInBlock);
    });
  },

  actions: {
    editBlock: function() {
      this.set('isEditing', true);
      this.resetBlockData();
    },
    saveBlock() {
      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        return;
      }
      this.set('model.title', this.get('title'));
      this.set('model.helpText', this.get('helpText'));
      this.get('model').save().then(() => {
        this.set('errorMessage', false);
        this.set('isEditing', false);
        this.get('rebuildMenu')();
        this.rebuildFormText();
      });
    },
    setDefault: function(dropdownModel) {
      let dropdowns = this.get('model.blockDropdowns');
      dropdowns.forEach((dropdown) => {
        dropdown.set('defaultTrue', false);
        dropdown.set('selected', false);
        dropdown.save();
      });
      dropdownModel.set('defaultTrue', true);
      dropdownModel.set('selected', true);
      dropdownModel.save();
    },
    cancelEditing() {
      this.resetBlockData();
      this.set('isEditing', false);
      this.set('errorMessage', false);
    },
    rebuildText() {
      this.get('rebuildText')();
    },
    rebuildMenu() {
      this.get('rebuildMenu')();
    },
    updateCheckbox(checkbox) {

      checkbox.toggleProperty('selected');
      checkbox.save();
      this.get('rebuildMenu')();
      this.get('rebuildText')();
    },


  }
});
