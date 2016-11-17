import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  menuText: null,
  hasValidMenuText: Ember.computed.notEmpty('menuText'),
  hasErrors: Ember.computed.not('hasValidMenuText'),

  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),

  validate() {
    this.set('errors.title', this.get('hasValidMenuText') ? null : "title is required.");
  },


  resetBlockData() {
    ['menuText'].forEach((field) => {
      const model = this.get('model');
      const valueInDropdown = model.get(field);
      this.set(field, valueInDropdown);
    });
  },

  actions: {
    editCheckbox: function() {
      this.set('isEditing', true);
      this.resetBlockData();
    },
    saveCheckbox() {
      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        return;
      }
      const model = this.get('model');
      model.set('menuText', this.get('menuText'));
      model.save().then(() => {
        this.get('rebuildMenu')();
        this.get('rebuildFormText')();
        this.set('isEditing', false);
      });
    },
    cancelCheckbox() {
      this.resetBlockData();
      this.set('isEditing', false);
    },
  }
});
