import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('library/full-clause', {
      into: 'application',
    });
  },

});
