import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  text: null,
  tagName: 'tr',

  resetBlockData() {
    ['text'].forEach((field) => {
      const model = this.get('model');
      const valueInDropdown = model.get(field);
      this.set(field, valueInDropdown);
    });
  },

  actions: {
    editCheckboxChoice: function() {
      this.set('isEditing', true);
      this.resetBlockData();
    },
    saveCheckboxChoice() {
      const model = this.get('model');
      model.set('text', this.get('text'));
      model.save().then(() => {
        this.get('rebuildText')();
        this.set('isEditing', false);
      });
    },
    cancelCheckboxChoice() {
      this.resetBlockData();
      this.set('isEditing', false);
    },
  }
});
