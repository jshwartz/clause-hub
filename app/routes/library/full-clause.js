import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('library/full-clause', {
      into: 'application',
    });
  },
  resetController: function(controller, isExiting, transition) {
    if (isExiting) {
      controller.set('currentBlock', null);
    }
  },
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
