import Ember from 'ember';
import clauseUpdate from '../mixins/clauseupdate';

export default Ember.Component.extend(clauseUpdate, {
  user: Ember.inject.service(),
  isEditing: false,
  errors: null,
  errorMessage: false,
  title: null,
  hasValidTitle: Ember.computed.notEmpty('title'),
  helpText: null,
  hasErrors: Ember.computed.not('hasValidTitle'),
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
    updateLastModified() {
      this.updateLastModified(this.get('model.clause'));
    },
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
      // this.updateLastModified();
      this.updateLastModified(this.get('model.clause'));
      this.set('errorMessage', false);
      this.set('isEditing', false);
    },
    // saveDropdown: function(properties) {
    //   this.get('saveDropdown')(properties);
    // },
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
    reorderItems(newDropdowns) {
      newDropdowns.forEach((newDropdown, index) => {
        const newOrderNumber = index + 1;
        Ember.set(newDropdown, 'orderNumber', newOrderNumber);
      });
      this.set('model.dropdowns', newDropdowns);
      this.get('model').save().then(() => {
        this.get('rebuildMenu')();
      });
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
    // createNewDropdown() {
    //   this.dropdownValidate();
    //   if (this.get('dropdownHasErrors')) {
    //     this.set('dropdownErrorMessage', true);
    //     return false;
    //   }
    //   this.get('createNewDropdown')(this.getProperties(['newMenuTitle', 'newText']));
    // },
    createNewDropdown() {
      this.dropdownValidate();
      if (this.get('dropdownHasErrors')) {
        this.set('dropdownErrorMessage', true);
        return false;
      }
      const menuTitle = this.get('newMenuTitle');
      const text = this.get('newText');
      if (this.get('model.dropdowns')) {
        let dropdowns = this.get('model.dropdowns');
        const orderNumber = this.get('model.dropdowns.length') + 1;
        const newDropdown = {menuTitle: menuTitle, text: text, orderNumber: orderNumber, defaultTrue: false, selected: false};
        dropdowns.pushObject(newDropdown);
      } else {
        const newDropdown = [{menuTitle: menuTitle, text: text, orderNumber: 1, defaultTrue: true, selected: true}];
        this.set('model.dropdowns', newDropdown);
      }
      this.get('model').save();
      this.updateLastModified(this.get('model.clause'));
    },
    // deleteDropdown(dropdown){
    //   this.get('deleteDropdown')(dropdown);
    //   this.updateLastModified();
    // },
    deleteConfirm() {
      this.set('deleteMessage', true);
    },
    cancelDelete() {
      this.set('deleteMessage', false);
    },
    destroyBlock() {
      this.get('destroyBlock')();
      this.updateLastModified(this.get('model.clause'));
    }

  }
});
