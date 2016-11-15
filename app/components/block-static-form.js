import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  staticText: null,
  hasValidStaticText: Ember.computed.notEmpty('staticText'),
  hasErrors: Ember.computed.not('hasValidStaticText'),
  deleteMessage: false,

  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),


  resetOnInit: Ember.on('init', function() {
    this.resetBlockData();
  }),

  resetBlockData() {
    ['staticText'].forEach((field) => {
      const valueInBlock = this.get('model').get(field);
      this.set(field, valueInBlock);
    });
  },

  validate() {
    this.set('errors.staticText', this.get('hasValidStaticText') ? null : "In a static block, text is required.");
  },

  actions: {
    saveBlock() {
      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        return;
      }
      this.get('saveBlock')(this.getProperties(['staticText']));
      this.set('errorMessage', false);
      this.set('isEditing', false);
    },
    editBlock: function() {
      this.set('isEditing', true);
    },
    cancelEditing() {
      this.resetBlockData();
      this.set('isEditing', false);
      this.set('errorMessage', false);
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
