import Ember from 'ember';

export default Ember.Component.extend({


  didInsertElement() {
    this._super(...arguments);
    this.$('.ui.clause.modal').modal('show');
  },

  actions: {

    approveModal: function(element, component) {
      alert('approve ' + component.get('name'));
      return false;
    },

    onClose: function() {
      this.get('onClose')();
    },

    updateDropdown: function(choice) {
      this.get('updateDropdown')(choice);
    },

    updateCheckbox: function(choice) {
      this.get('updateCheckbox')(choice);
      Ember.$('.flash-text').effect("highlight", {}, 3000);

    }
  }
});
