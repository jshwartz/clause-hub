import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('library/full-clause', {
      into: 'application',
    });
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
