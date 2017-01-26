import Ember from 'ember';

export default Ember.Route.extend({

  resetController: function(controller, isExiting, transition) {
    if (isExiting) {
      controller.set('currentBlock', null);
    }
  },
  afterModel: function() {
    this.transitionTo('library.fullClause.dashboard');
  },
  actions: {
  didTransition() {
    this.controllerFor('library.fullClause.dashboard').toggleProperty('rebuildText');
    }
  }
  // setupController: function(controller, model) {
  //   this._super(controller, model);
  //   model.get('blocks').then((blocks) => {
  //     blocks.forEach((block) => {
  //       if (block.get('orderNumber') === 1) {
  //         console.log('hi');
  //         controller.set('firstBlock', block);
  //       }
  //     });
  //   });
  // }


});
