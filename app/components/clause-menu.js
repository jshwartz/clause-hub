import Ember from 'ember';

export default Ember.Component.extend({
  rebuildMenu: false,
  rebuildText: false,
  sortBy: ['order'],

  menuArray: Ember.computed('rebuildMenu', function() {
    let result = [];
    this.get('model.blocks').then(function(blocks){
      blocks.forEach( (block) => {
        const type = block.get('type');
        const orderNumber = block.get('orderNumber');
        const title = block.get('title');
        const helpText = block.get('helpText');
        if (type === "dropdown") {
          let choiceArray = [];
          let selectedOption = "";
          block.get('blockDropdowns').then(function(dropdowns) {
            dropdowns.forEach( (dropdown) => {
              const dropOrderNumber = dropdown.get('orderNumber');
              const selected = dropdown.get('defaultTrue');
              const menuText = dropdown.get('menuText');
              const block = dropdown.get('block.id');
              const id = dropdown.get('id');
              choiceArray.addObject({dropOrderNumber: dropOrderNumber, menuText: menuText, id: id, block: block});
              if (selected) {
                selectedOption = menuText;
              }
            });
            result.addObject({order: orderNumber, type: type, helpText: helpText, title: title, dropdown: true, choices: choiceArray, selectedOption: selectedOption});
          });
        }
        if (type === "checkbox") {
          let checkboxArray = [];
          block.get('blockCheckboxes').then(function(checkboxes) {
            checkboxes.forEach( (checkbox) => {
              const checkboxOrderNumber = checkbox.get('orderNumber');
              const selected = checkbox.get('selected');
              const menuText = checkbox.get('menuText');
              const block = checkbox.get('block.id');
              const id = checkbox.get('id');
              checkboxArray.addObject({selected: selected, checkboxOrderNumber: checkboxOrderNumber, menuText: menuText, id: id, block: block});
            });
            result.addObject({order: orderNumber, type: type, helpText: helpText, title: title, checkbox: true, choices: checkboxArray});
          });

        }
      });
    });
    return result;
  }),
  sortedMenuArray: Ember.computed.sort('menuArray', 'sortBy'),
  actions: {
    updateDropdown: function(choice) {
      const blocks = this.get('model.blocks');
      blocks.forEach( (block) => {
        if (block.get('id') === choice.block) {
          block.get('blockDropdowns').forEach( (dropdown) => {
            if (dropdown.get('id') !== choice.id) {
              dropdown.set('defaultTrue', false);
            } else {
              dropdown.set('defaultTrue', true);
            }
            this.toggleProperty('rebuildText');
          });
        }
      });
    },
    updateCheckbox: function(choice) {
      const blocks = this.get('model.blocks');
      blocks.forEach( (block) => {
        if (block.get('id') === choice.block) {
          block.get('blockCheckboxes').forEach( (checkbox) => {
            if (checkbox.get('id') === choice.id) {
              checkbox.toggleProperty('selected');
            }
            this.toggleProperty('rebuildText');
          });
        }
      });
    }
  }

});