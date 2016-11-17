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
    let checkboxes = this.get('model.blockCheckboxes');
    let choices = this.get('model.blockCheckboxChoices');
    choices.forEach((choice) => {
      choice.set('active', true);
      choice.save();
    }).then(() => {
      checkboxes.forEach((checkbox) => {
        const checkboxNumber = checkbox.get('orderNumber').toString();
        if (checkbox.get('active') === false) {
          choices.forEach((choice) => {
            const choiceBoxes = choice.get('checkboxes').toString();
            if (choiceBoxes.includes(checkboxNumber)) {
              choice.set('active', false);
              choice.save();
            }
          });
        }
      });
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
      });
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
      checkbox.toggleProperty('defaultTrue');
      checkbox.save();
      this.get('rebuildMenu')();
      this.get('rebuildText')();
    },
    onCheckbox(checkbox) {
      checkbox.set('active', true);
      checkbox.save().then(() => {this.setCheckboxChoices();});
    },
    offCheckbox(checkbox) {
      checkbox.set('active', false);
      checkbox.set('defaultTrue', false);
      checkbox.set('selected', false);
      checkbox.save().then(() => {this.setCheckboxChoices();});
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
        choice.set('formText', formTextTemp);
        choice.save();
      });
    },
  }
});
