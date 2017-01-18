import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('group-library/settings', {
      into: 'application',
    });
  },
});
