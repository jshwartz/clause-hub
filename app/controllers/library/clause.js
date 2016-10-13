import Ember from 'ember';

export default Ember.Controller.extend({
  titlesChanged: false,
  modelChanged: Ember.observer('model.title', function() {
    // deal with the change
    this.toggleProperty('titlesChanged');
    console.log(`modelchanged`);
  }),
  blockArray: Ember.computed('titlesChanged', function() {
    let result = [];
    this.get('model.blocks').then(function(blocks){
      blocks.forEach( (block) => {
        const type = block.get('type');
        const orderNumber = block.get('orderNumber');
        const helpText = block.get('helpText');
        const title = block.get('title');
        let text = '';
        if (type === 'dropdown') {
          const dropdowns = block.get('block.blockDropdowns');
          dropdowns.forEach( (dropdown) => {
            console.log('dropdown');
          });
        }
        result.addObject({order: orderNumber, type: type, helpText: helpText, title: title});
      });
    });
    return result;
  }),
  sortBy: ['order'],
  sortedBlockArray: Ember.computed.sort('blockArray', 'sortBy'),
  finalText: Ember.computed('sortedBlockArray', function() {
    const sortedBlockArray = this.get('sortedBlockArray');
    let result = "";
    for (let object of sortedBlockArray) {
      result = result.concat(object.type);
    }
    return result;
  }),


  actions: {
    transitionLibrary: function() {
      this.transitionToRoute('library');
    }
  }
});
