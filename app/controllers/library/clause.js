import Ember from 'ember';

export default Ember.Controller.extend({
  gender: null,
  rebuildText: false,
  rebuildMenu: false,
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




  menuOptions: [ {title: "Choice something", dropdown: true, choices: ["Option 1", "Option 2"]}, {title: "Choose something else", checkboxes: true, choices: ["checkbox 1", "checkbox 2"]} ],


  actions: {
    transitionLibrary: function() {
      this.transitionToRoute('library');
    },
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
