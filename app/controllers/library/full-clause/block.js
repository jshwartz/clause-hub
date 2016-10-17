import Ember from 'ember';

export default Ember.Controller.extend({
  isEditing: false,

  actions: {
    editBlock: function() {
      this.set('isEditing', true);
    },

    saveBlock: function() {
      this.set('isEditing', false);
    }
  }
});
