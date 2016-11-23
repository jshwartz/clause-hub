import Ember from 'ember';

export default Ember.Component.extend({
  rebuildMenu: false,
  rebuildText: false,
  activeBlock: null,
  sortBy: ['order'],

  menuArray: Ember.computed('rebuildMenu', function() {
    let result = [];
    this.get('model.blocks').then(function(blocks){
      blocks.forEach( (block) => {
        const type = block.get('type');
        const orderNumber = block.get('orderNumber');
        const title = block.get('title');
        const helpText = block.get('helpText');
        const blockID = block.get('id');
        if (type === "dropdown") {
          let choiceArray = [];
          let selectedOption = "";
          block.get('blockDropdowns').then(function(dropdowns) {
            dropdowns.forEach( (dropdown) => {
              const dropOrderNumber = dropdown.get('orderNumber');
              const selected = dropdown.get('selected');
              const menuText = dropdown.get('menuText');
              const block = dropdown.get('block.id');
              const id = dropdown.get('id');
              choiceArray.addObject({dropOrderNumber: dropOrderNumber, menuText: menuText, id: id, block: block});
              if (selected) {
                selectedOption = menuText;
              }
            });
            let sortedChoiceArray = choiceArray.sort(function(a, b) {
              return a.dropOrderNumber-b.dropOrderNumber;
            });
            result.addObject({order: orderNumber, type: type, helpText: helpText, title: title, dropdown: true, choices: sortedChoiceArray, selectedOption: selectedOption, blockID: blockID});
          });
        }
        if (type === "checkbox") {
          let checkboxArray = [];
          block.get('blockCheckboxes').then(function(checkboxes) {
            checkboxes.forEach( (checkbox) => {
              if (checkbox.get('active')) {
                const checkboxOrderNumber = checkbox.get('orderNumber');
                const selected = checkbox.get('selected');
                const menuText = checkbox.get('menuText');
                const block = checkbox.get('block.id');
                const id = checkbox.get('id');
                checkboxArray.addObject({selected: selected, checkboxOrderNumber: checkboxOrderNumber, menuText: menuText, id: id, block: block});
              }
            });
            result.addObject({order: orderNumber, type: type, helpText: helpText, title: title, checkbox: true, choices: checkboxArray, blockID: blockID});
          });

        }
        if (type === "toggle") {
          const selected = block.get('selected');
          result.addObject({order: orderNumber, type: type, helpText: helpText, title: title, toggle: true, selected: selected, block: blockID, blockID: blockID});
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
              dropdown.set('selected', false);
            } else {
              dropdown.set('selected', true);
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
    },
    updateToggle: function(option) {
      const blocks = this.get('model.blocks');
      blocks.forEach( (block) => {
        if (block.get('id') === option.block) {
          block.toggleProperty('selected');
        }
        this.toggleProperty('rebuildText');
      });
    },
    sendActiveBlock(blockID) {
      this.set('activeBlock', blockID);
    }
  }

});
