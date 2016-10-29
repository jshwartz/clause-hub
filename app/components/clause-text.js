import Ember from 'ember';

export default Ember.Component.extend({
  sortBy: ['order'],
  activeBlock: null,
  copyText: null,


  // extract selected clause text into array
  textArray: Ember.computed('rebuildText', 'activeBlock', function() {
    const activeBlock = this.get('activeBlock');
    let result = [];
    this.get('model.blocks').then(function(blocks){
      blocks.forEach( (block) => {
        const type = block.get('type');
        const orderNumber = block.get('orderNumber');
        let highlightBlock = false;
        if (activeBlock === parseInt(block.get('id'))) {
          highlightBlock = true;
        }
        let text = '';
        // extract dropdown final text
        if (type === 'dropdown') {
          block.get('blockDropdowns').then(function(dropdowns) {
            dropdowns.forEach( (dropdown) => {
              const dropdownSelected = dropdown.get('selected');
              const dropdownText = dropdown.get('text');
              if (dropdownSelected) {
                if (highlightBlock) {
                  text = "<span class='text-highlight'>" + dropdownText + "</span'>";
                } else {
                  text = dropdownText;
                }
              }
            });
            result.addObject({order: orderNumber, text: text});
          });
          // extract static final text
        } else if (type === 'static') {
          const staticText = block.get('staticText');
          if (highlightBlock) {
            text = "<span class='text-highlight'>" + staticText + "</span'>";
          } else {
            text = staticText;
          }
          result.addObject({order: orderNumber, text: text});
          //extract checkbox final text
        } else if (type === 'toggle') {
          const staticText = block.get('staticText');
          const toggleSelected = block.get('selected');
          if (highlightBlock) {
            text = "<span class='text-highlight'>" + staticText + "</span'>";
          } else {
            text = staticText;
          }
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
                  if (highlightBlock) {
                    text = "<span class='text-highlight'>" + choice.get('text') + "</span'>";
                  } else {
                    text = choice.get('text');
                  }
                  result.addObject({order: orderNumber, text: text});
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
    let resultArray = [];
    sortedBlockArray.forEach((block) => {
      resultArray.pushObject(block.text);
      });
    return resultArray;
  }),


});
