import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  text: null,
  tagName: 'tr',

  // resetBlockData() {
  //   ['text'].forEach((field) => {
  //     const model = this.get('model');
  //     const valueInDropdown = model.get(field);
  //     this.set(field, valueInDropdown);
  //   });
  // },

  actions: {
    editCheckboxChoice: function() {
      this.set('isEditing', true);
      const model = this.get('model');
      this.set('text', model.text);
    },
    saveCheckboxChoice() {
      const model = this.get('model');
      Ember.set(model, 'text', this.get('text'));
      this.get('block').save().then(() => {
        this.get('rebuildText')();
        this.set('isEditing', false);
        this.get('updateLastModified')();
      });
    },
    cancelCheckboxChoice() {
      this.set('isEditing', false);
    },
  }
});
