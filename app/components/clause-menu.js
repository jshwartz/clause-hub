import Ember from 'ember';

export default Ember.Component.extend({
  rebuildMenu: false,
  rebuildText: false,
  activeBlock: null,
  sortBy: ['orderNumber'],

  sortedMenuArray: Ember.computed.sort('model.blocks', 'sortBy'),
  menuArray: Ember.computed('sortedMenuArray', function() {
    let result = [];
    this.get('sortedMenuArray').forEach( (block, index) => {
      const type = block.get('type');
      const orderNumber = block.get('orderNumber');
      const title = block.get('title');
      const helpText = block.get('helpText');
      const blockID = block.get('id');
      let openMe = false;
      if (index === 0) {
        openMe = false;
      }
      if (type === "dropdown") {
        let choiceArray = [];
        let selectedOption = "";
        block.get('dropdowns').forEach( (dropdown) => {
          const dropOrderNumber = dropdown.orderNumber;
          const selected = dropdown.selected;
          const menuTitle = dropdown.menuTitle;
          const blockID = block.get('id');
          choiceArray.addObject({dropOrderNumber: dropOrderNumber, menuTitle: menuTitle, blockID: blockID});
          if (selected) {
            selectedOption = menuTitle;
          }
        });

        let sortedChoiceArray = choiceArray.sort(function(a, b) {
          return a.dropOrderNumber-b.dropOrderNumber;
        });
        result.addObject({order: orderNumber, type: type, helpText: helpText, title: title, dropdown: true, choices: sortedChoiceArray, selectedOption: selectedOption, blockID: blockID, openMe: openMe});
      }
      if (type === "checkbox") {
        let checkboxArray = [];
        block.get('checkboxes').forEach(function(checkbox) {
            if (checkbox.active) {
              checkboxArray.addObject({selected: checkbox.selected, menuText: checkbox.menuText, orderNumber: checkbox.orderNumber, blockID: blockID});
            }
          });
          result.addObject({order: orderNumber, type: type, helpText: helpText, title: title, checkbox: true, choices: checkboxArray, blockID: blockID, openMe: openMe});

      }
      if (type === "toggle") {
        const selected = block.get('selected');
        result.addObject({order: orderNumber, type: type, helpText: helpText, title: title, toggle: true, selected: selected, block: blockID, blockID: blockID, openMe: openMe});
      }
    });
    return result;
  }),
  actions: {
    updateDropdown: function(choice) {
      const blocks = this.get('model.blocks');
      blocks.forEach( (block) => {
        if (block.get('id') === choice.blockID) {
          block.get('dropdowns').forEach( (dropdown) => {
            if (dropdown.orderNumber !== choice.dropOrderNumber) {
              Ember.set(dropdown, 'selected', false);
            } else {
              Ember.set(dropdown, 'selected', true);
            }
            this.toggleProperty('rebuildText');
          });
          block.toggleProperty('selected');
        }
      });
    },
    updateCheckbox: function(choice) {
      const blocks = this.get('model.blocks');
      blocks.forEach( (block) => {
        if (block.get('id') === choice.blockID) {
          block.get('checkboxes').forEach( (checkbox) => {
            if (checkbox.orderNumber === choice.orderNumber) {
              if (checkbox.selected) {
                Ember.set(checkbox, 'selected', false);
              } else {
                Ember.set(checkbox, 'selected', true);
              }
            }
            this.toggleProperty('rebuildText');
            block.toggleProperty('selected');

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
