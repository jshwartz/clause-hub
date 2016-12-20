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


  // resetBlockData() {
  //   ['menuText'].forEach((field) => {
  //     const model = this.get('model');
  //     const valueInDropdown = model.get(field);
  //     this.set(field, valueInDropdown);
  //   });
  // },

  actions: {
    editCheckbox: function() {
      this.set('isEditing', true);
      this.set('menuText', this.get('model.menuText'));
    },
    saveCheckbox() {
      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        return;
      }
      const model = this.get('model');
      Ember.set(model, 'menuText', this.get('menuText'));
      this.get('block').save().then(() => {
        this.get('updateLastModified')();
        this.get('rebuildMenu')();
        this.get('rebuildFormText')();
        this.set('isEditing', false);
      });
    },
    cancelCheckbox() {
      this.set('isEditing', false);
    },
  }
});
