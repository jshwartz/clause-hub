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
  newMenuTitle: null,
  hasValidNewMenuTitle: Ember.computed.notEmpty('newMenuTitle'),
  newText: null,
  dropdownHasErrors: Ember.computed.not('hasValidNewMenuTitle'),
  dropdownErrorMessage: false,
  deleteMessage: false,

  dropdownBuild: Ember.observer('rebuildDropdowns', function(){
    const dropdowns = this.get('model.blockDropdowns');
    this.send('reorderItems', dropdowns);
  }),

  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),

  setupDropdownErrors: Ember.on('init', function() {
    this.set('dropdownErrors', Ember.Object.create());
  }),

  validate() {
    this.set('errors.title', this.get('hasValidTitle') ? null : "Menu title is required.");
  },

  dropdownValidate() {
    this.set('dropdownErrors.title', this.get('hasValidNewMenuTitle') ? null : "Dropdown title is required.");
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
    newDropdown() {
      this.$('.ui.dropdown.modal').modal('show');
    },
    cancelNewDropdown() {
      this.set('newMenuTitle', null);
      this.set('newText', null);
      this.set('dropdownErrorMessage', false);
      this.set('dropdownErrors.title', null);
    },
    createNewDropdown() {
      this.dropdownValidate();
      if (this.get('dropdownHasErrors')) {
        this.set('dropdownErrorMessage', true);
        return false;
      }
      this.get('createNewDropdown')(this.getProperties(['newMenuTitle', 'newText']));
    },
    deleteDropdown(dropdown){
      this.get('deleteDropdown')(dropdown);
    },
    deleteConfirm() {
      this.set('deleteMessage', true);
    },
    cancelDelete() {
      this.set('deleteMessage', false);
    },
    destroyBlock() {
      this.get('destroyBlock')();
    }

  }
});
