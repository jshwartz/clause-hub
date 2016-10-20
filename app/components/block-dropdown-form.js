import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  errors: null,
  errorMessage: false,
  title: null,
  hasValidTitle: Ember.computed.notEmpty('title'),
  helpText: null,
  sortBy: ['orderNumber'],
  hasErrors: Ember.computed.not('hasValidTitle'),
  sortedDropdowns: Ember.computed.sort('model.blockDropdowns', 'sortBy'),

  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),

  validate() {
    this.set('errors.title', this.get('hasValidTitle') ? null : "Menu title is required.");
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.resetBlockData();
  },
  init() {
    this._super(...arguments);
    this.resetBlockData();
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
    },
    saveBlock() {

      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        return;
      }
      this.get('saveBlock')(this.getProperties(['title', 'helpText']));
      this.set('errorMessage', false);
      this.set('isEditing', false);
    },
    saveDropdown: function(properties) {
      this.get('saveDropdown')(properties);
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
    reorderItems(dropdownModels) {
      dropdownModels.forEach((dropdown, index) => {
        const newOrderNumber = index + 1;
        dropdown.set('orderNumber', newOrderNumber);
        dropdown.save();
      });
      this.get('rebuildMenu')();
    },

  }
});
