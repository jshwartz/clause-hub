import Ember from 'ember';

export default Ember.Component.extend({

  staticText: null,

  resetOnInit: Ember.on('init', function() {
    this.resetBlockData();
  }),

  resetBlockData() {
    ['staticText'].forEach((field) => {
      const valueInBlock = this.get('model').get(field);
      this.set(field, valueInBlock);
    });
  },

  actions: {
    saveBlock() {
      this.get('saveBlock')(this.getProperties(['staticText']));
    },
    cancelEditing() {
      this.get('cancelEditing')();
    }
  }
});
