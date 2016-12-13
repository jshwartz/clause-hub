import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  errors: null,
  errorMessage: false,
  text: null,
  menuTitle: null,
  hasValidMenuTitle: Ember.computed.notEmpty('menuTitle'),
  hasErrors: Ember.computed.not('hasValidMenuTitle'),
  deleteMessage: false,


  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),

  validate() {
    this.set('errors.title', this.get('hasValidMenuTitle') ? null : "Dropdown title is required.");
  },

  resetBlockData() {
    const model = this.get('model');
    this.set('menuTitle', model.menuTitle);
    this.set('text', model.text);
  },

  actions: {
    editDropdown: function() {
      this.set('isEditing', true);
      this.resetBlockData();
    },
    saveDropdown() {

      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        return;
      }
      this.set('model.text', this.get('text'));
      this.set('model.menuTitle', this.get('menuTitle'));
      this.get('clause').save().then(() => {
        this.set('isEditing', false);
        this.set('errorMessage', false);

      });
    },
    cancelDropdown() {
      this.resetBlockData();
      this.set('isEditing', false);
      this.set('errorMessage', false);
      this.set('errors.title', null);
    },
    setDefault()  {
      this.get('clause.dropdowns').forEach((dropdown) => {
        Ember.set(dropdown, 'defaultTrue', false);
        Ember.set(dropdown, 'selected', false);
      });
      this.set('model.defaultTrue', true);
      this.set('model.selected', true);
      this.get('clause').save();
    },
    deleteDropdown() {
      const indexNumber = this.get('model.orderNumber') - 1;
      const dropdowns = this.get('clause.dropdowns');
      dropdowns.splice(indexNumber , 1);
      dropdowns.forEach((dropdown, index) => {
        const newOrderNumber = index + 1;
        Ember.set(dropdown, 'orderNumber', newOrderNumber);
      });
      this.set('clause.dropdowns', dropdowns);
      this.get('clause').save().then(() => {
        //need to add a rebuild menu and clause text thing.
      });
    },
    deleteConfirm() {
      this.set('deleteMessage', true);
    },
    cancelDelete() {
      this.set('deleteMessage', false);
    },

  }

});
