import Ember from 'ember';

export default Ember.Controller.extend({
  titlesChanged: false,
  blockArray: Ember.computed('titlesChanged', function() {
    const blocks = this.get('model.blocks');
    let result = [];
    blocks.forEach( (block) => {
      const type = block.get('title');
      const orderNumber = block.get('orderNumber');
      result.addObject({order: orderNumber, text: type});
    });
    return result;
  }),
  sortBy: ['order'],
  sortedBlockArray: Ember.computed.sort('blockArray', 'sortBy'),
  finalText: Ember.computed('sortedBlockArray', function() {
    const sortedBlockArray = this.get('sortedBlockArray');
    let result = "";
    for (let object of sortedBlockArray) {
      result = result.concat(object.text);
    }
    return result;
  }),


  actions: {
    transitionLibrary: function() {
      this.transitionToRoute('library');
    }
  }
});
