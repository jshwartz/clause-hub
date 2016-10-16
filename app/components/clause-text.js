import Ember from 'ember';

export default Ember.Component.extend({
  sortBy: ['order'],


  // extract selected clause text into array
  textArray: Ember.computed('rebuildText', function() {
    let result = [];
    this.get('model.blocks').then(function(blocks){
      blocks.forEach( (block) => {
        const type = block.get('type');
        const orderNumber = block.get('orderNumber');
        let text = '';
        // extract dropdown final text
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
          // extract static final text
        } else if (type === 'static') {
          const staticText = block.get('staticText');
          text = staticText;
          result.addObject({order: orderNumber, text: text});
          //extract checkbox final text
        } else if (type === 'toggle') {
          const staticText = block.get('staticText');
          const toggleSelected = block.get('selected');
          text = staticText;
          console.log(toggleSelected);

          if (toggleSelected) {
            result.addObject({order: orderNumber, text: text});
          }
        } else if (type === 'checkbox') {
          let selected = null;
          block.get('blockCheckboxes').then(function(checkboxes) {
            let selectedArray = [];
            checkboxes.forEach( (checkbox) => {
              if (checkbox.get('selected')) {
                selectedArray.push(checkbox.get('orderNumber'));
              }
            });
            selected = parseInt(selectedArray.sort().join(""));
            if (isNaN(selected)) {
              selected = 0;
            }
            block.get('blockCheckboxChoices').then(function(choices) {
              choices.forEach( (choice) => {
                if (selected === choice.get('checkboxes')) {
                  result.addObject({order: orderNumber, text: choice.get('text')});
                }
              });
            });
          });
        }
      });
    });
    return result;
  }),
  // sort final text array

  sortedTextArray: Ember.computed.sort('textArray', 'sortBy'),
  // build final text block
  finalText: Ember.computed('sortedTextArray', function() {
    const sortedBlockArray = this.get('sortedTextArray');
    let result = "";
    for (let object of sortedBlockArray) {
      result = result.concat(object.text);
    }
    return result;
  }),


});
