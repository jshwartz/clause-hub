import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  staticText: null,
  hasValidStaticText: Ember.computed.notEmpty('staticText'),
  title: null,
  hasValidTitle: Ember.computed.notEmpty('title'),
  helpText: null,
  deleteMessage: false,
  hasErrors: Ember.computed('hasValidTitle', 'hasValidStaticText', function() {
    const hasValidTitle = this.get('hasValidTitle');
    const hasValidStaticText = this.get('hasValidStaticText');
    if (hasValidTitle && hasValidStaticText) {
      return false;
    } else {
      return true;
    }
  }),

  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),


  resetOnInit: Ember.on('init', function() {
    this.resetBlockData();
  }),

  resetBlockData() {
    ['staticText', 'title', 'helpText'].forEach((field) => {
      const valueInBlock = this.get('model').get(field);
      this.set(field, valueInBlock);
    });
  },

  validate() {
    this.set('errors.staticText', this.get('hasValidStaticText') ? null : "In a toggle block, text is required.");
    this.set('errors.title', this.get('hasValidTitle') ? null : "Title is required.");
  },

  actions: {
    saveBlock() {
      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        return;
      }
      this.get('saveBlock')(this.getProperties(['staticText', 'title', 'helpText']));
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
    defaultOn() {
      this.set('model.defaultTrue', true);
      this.set('model.selected', true);
      this.model.save();
    },
    defaultOff() {
      this.set('model.defaultTrue', false);
      this.set('model.selected', false);
      this.model.save();
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
