import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, models) {
    controller.setProperties(models);
  }
});
