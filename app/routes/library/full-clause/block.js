import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    toggleRebuildText: function() {
      const parentController = this.controllerFor('library.full-clause');
      parentController.toggleProperty('rebuildText');
    },
    toggleRebuildMenu: function() {
      const parentController = this.controllerFor('library.full-clause');
      parentController.toggleProperty('rebuildMenu');
    },
  }

});
