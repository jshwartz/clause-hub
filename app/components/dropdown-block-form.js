import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  errors: null,
  errorMessage: false,
  text: null,
  menuText: null,
  hasValidMenuText: Ember.computed.notEmpty('menuText'),
  sortBy: ['orderNumber'],
  hasErrors: Ember.computed.not('hasValidMenuText'),

  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),

  validate() {
    this.set('errors.title', this.get('hasValidMenuText') ? null : "Dropdown title is required.");
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.resetBlockData();
  },

  resetBlockData() {
    ['text', 'menuText'].forEach((field) => {
      const valueInBlock = this.get('model').get(field);
      this.set(field, valueInBlock);
    });
  },

  actions: {
    editDropdown: function() {
      this.set('isEditing', true);
    },
    saveDropdown() {

      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        return;
      }
      const model = this.get('model');
      model.set('text', this.get('text'));
      model.set('menuText', this.get('menuText'));
      model.save().then(() => {
        this.get('rebuildText')();
        this.set('isEditing', false);
        this.set('errorMessage', false);

      });
    },
    cancelDropdown() {
      this.resetBlockData();
      this.set('isEditing', false);
      this.set('errorMessage', false);
    },

  }

});
