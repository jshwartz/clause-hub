import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    transitionLibrary: function() {
      this.transitionToRoute('library');
    },
  }
});
