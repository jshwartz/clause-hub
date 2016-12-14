import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  errors: null,
  errorMessage: false,
  title: null,
  hasValidTitle: Ember.computed.notEmpty('title'),
  helpText: null,
  // sortBy: ['orderNumber'],
  // sortedCheckboxes: Ember.computed.sort('model.blockCheckboxes', 'sortBy'),
  // sortChoicesBy: ['checkboxes'],
  // sortedCheckboxChoices: Ember.computed.sort('model.blockCheckboxChoices', 'sortChoicesBy'),
  hasErrors: Ember.computed.not('hasValidTitle'),
  deleteMessage: false,


  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),



  validate() {
    this.set('errors.title', this.get('hasValidTitle') ? null : "Menu title is required.");
  },

  resetBlockData() {
    ['title', 'helpText'].forEach((field) => {
      const valueInBlock = this.get('model').get(field);
      this.set(field, valueInBlock);
    });
  },

  setCheckboxChoices() {
    let checkboxes = this.get('model.checkboxes');
    let choices = this.get('model.checkboxChoices');
    choices.forEach((choice) => {
      Ember.set(choice, 'active', true);
    });
    checkboxes.forEach((checkbox) => {
      const checkboxNumber = checkbox.orderNumber.toString();
      if (checkbox.active === false) {
        choices.forEach((choice) => {
          const choiceBoxes = choice.checkboxes.toString();
          if (choiceBoxes.includes(checkboxNumber)) {
            Ember.set(choice, 'active', false);
          }
        });
      }
    });
    this.get('model').save();
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
      });
    },
    cancelEditing() {
      this.resetBlockData();
      this.set('isEditing', false);
      this.set('errorMessage', false);
      this.set('errors.title', null);
    },
    rebuildText() {
      this.get('rebuildText')();
    },
    rebuildMenu() {
      this.get('rebuildMenu')();
    },
    updateCheckbox(checkbox) {
      if (checkbox.selected) {
        Ember.set(checkbox, 'selected', false);
        Ember.set(checkbox, 'defaultTrue', false);
      } else {
        Ember.set(checkbox, 'selected', true);
        Ember.set(checkbox, 'defaultTrue', true);
      }
      this.get('model').save();
      this.get('rebuildMenu')();
      this.get('rebuildText')();
    },
    onCheckbox(checkbox) {
      Ember.set(checkbox, 'active', true);
      this.get('model').save().then(() => {this.setCheckboxChoices();});
    },
    offCheckbox(checkbox) {
      Ember.set(checkbox, 'active', false);
      Ember.set(checkbox, 'defaultTrue', false);
      Ember.set(checkbox, 'selected', false);
      this.get('model').save().then(() => {this.setCheckboxChoices();});
    },
    deleteConfirm() {
      this.set('deleteMessage', true);
    },
    cancelDelete() {
      this.set('deleteMessage', false);
    },
    destroyBlock() {
      this.get('destroyBlock')();
    },
    rebuildFormText() {
      let checkboxes = this.get('model.checkboxes');
      let choices = this.get('model.checkboxChoices');
      let checkboxArray = [];
      checkboxes.forEach((checkbox) => {
        const checkboxOrderNumber = checkbox.orderNumber;
        const menuText = checkbox.menuText;
        checkboxArray.addObject({checkboxOrderNumber: checkboxOrderNumber, menuText: menuText});
      });
      choices.forEach((choice) => {
        const checkboxString = choice.checkboxes.toString();
        const checkboxStringArray = checkboxString.split("");
        let formTextTemp = [];
        checkboxStringArray.forEach((valueInArray) => {
          checkboxArray.forEach((checkbox) => {
            if (checkbox.checkboxOrderNumber === parseInt(valueInArray)) {
              formTextTemp.push(checkbox.menuText);
            }
          });
        });
        Ember.set(choice, 'formText', formTextTemp);
        this.get('model').save();
      });
    },
  }
});
