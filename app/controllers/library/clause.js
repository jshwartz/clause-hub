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
        let text = '';
        if (type === 'dropdown') {
          block.get('blockDropdowns').then(function(dropdowns) {
            dropdowns.forEach( (dropdown) => {
              const defaultTrue = dropdown.get('defaultTrue');
              const dropdownText = dropdown.get('text');
              if (defaultTrue) {
                text = dropdownText;
              }
            });
            result.addObject({order: orderNumber, text: text});
          });
        } else if (type === 'static') {
          const staticText = block.get('staticText');
          text = staticText;
          result.addObject({order: orderNumber, text: text});
        }
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
