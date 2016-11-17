import Ember from 'ember';

export default Ember.Controller.extend({
  sortBy: ['orderNumber'],
  sortedBlocks: Ember.computed.sort('model.blocks', 'sortBy'),
  rebuildText: false,
  rebuildMenu: false,
  blocksActive: true,
  newBlockMenu: true,
  newBlockStatic: false,
  newBlockToggle: false,
  newBlockCheckbox: false,
  staticText: null,
  title: null,
  helpText: null,
  hasValidStaticText: Ember.computed.notEmpty('staticText'),
  hasValidTitle: Ember.computed.notEmpty('title'),
  hasStaticErrors: Ember.computed.not('hasValidStaticText'),
  hasMenuTitleErrors: Ember.computed.not('hasValidTitle'),
  hasToggleErrors: Ember.computed('hasValidTitle', 'hasValidStaticText', function() {
    const hasValidTitle = this.get('hasValidTitle');
    const hasValidStaticText = this.get('hasValidStaticText');
    if (hasValidTitle && hasValidStaticText) {
      return false;
    } else {
      return true;
    }
  }),
  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),

  validateStatic() {
    this.set('errors.staticText', this.get('hasValidStaticText') ? null : "Text is required.");
  },
  validateToggle() {
    this.set('errors.staticText', this.get('hasValidStaticText') ? null : "Text is required.");
    this.set('errors.title', this.get('hasValidTitle') ? null : "Title is required.");
  },
  validateMenuTitle() {
    this.set('errors.title', this.get('hasValidTitle') ? null : "Title is required.");
  },
  createStaticBlock() {
    this.validateStatic();
    if (this.get('hasStaticErrors')) {
      this.set('errorMessage', true);
      return false;
    }
    const orderNumber = this.get('model.blocks.length') + 1;
    const newStaticBlock = this.get('store').createRecord('block', {
      staticText: this.get('staticText'),
      type: "static",
      clause: this.get('model'),
      orderNumber: orderNumber,
    });
    newStaticBlock.save()
      .then(() => {
        this.get('model').save();
      })
      .catch(error => {
        console.error("Error saving player", error);
      });
  },
  createToggleBlock() {
    const orderNumber = this.get('model.blocks.length') + 1;
    const newToggleBlock = this.get('store').createRecord('block', {
      staticText: this.get('staticText'),
      title: this.get('title'),
      type: "toggle",
      clause: this.get('model'),
      orderNumber: orderNumber,
    });
    newToggleBlock.save()
      .then(() => {
        this.get('model').save();
      })
      .catch(error => {
        console.error("Error saving player", error);
      });
  },
  createCheckboxBlock() {
    const orderNumber = this.get('model.blocks.length') + 1;
    const newCheckboxBlock = this.get('store').createRecord('block', {
      title: this.get('title'),
      helpText: this.get('helpText'),
      type: "checkbox",
      clause: this.get('model'),
      orderNumber: orderNumber,
    });
    newCheckboxBlock.save().then((newBlock) => {
        this.get('model').save().then(() => {
          const newCheckbox1 = this.get('store').createRecord('blockCheckbox', {
            active: false,
            defaultTrue: false,
            orderNumber: 1,
            selected: false,
            block: newBlock,
            menuText: "Option 1"
          });
          newCheckbox1.save();
          const newCheckbox2 = this.get('store').createRecord('blockCheckbox', {
            active: false,
            defaultTrue: false,
            orderNumber: 2,
            selected: false,
            block: newBlock,
            menuText: "Option 2"
          });
          newCheckbox2.save();
          const newCheckbox3 = this.get('store').createRecord('blockCheckbox', {
            active: false,
            defaultTrue: false,
            orderNumber: 3,
            selected: false,
            block: newBlock,
            menuText: "Option 3"
          });
          newCheckbox3.save();
          const newChoice0 = this.get('store').createRecord('blockCheckboxChoice', {
            active: false,
            defaultTrue: true,
            checkboxes: 0,
            block: newBlock,
            formText: [],
            text: "Hi, I'm the text that will display when no checkboxes are selected",
          });
          newChoice0.save();
          const newChoice1 = this.get('store').createRecord('blockCheckboxChoice', {
            active: false,
            defaultTrue: false,
            checkboxes: 1,
            block: newBlock,
            formText: ["Option 1"],
            text: "Hi, I'm the text that will display when only checkbox 1 is selected",
          });
          newChoice1.save();
          const newChoice2 = this.get('store').createRecord('blockCheckboxChoice', {
            active: false,
            defaultTrue: false,
            checkboxes: 2,
            block: newBlock,
            formText: ["Option 2"],
            text: "Hi, I'm the text that will display when only checkbox 2 is selected",
          });
          newChoice2.save();
          const newChoice3 = this.get('store').createRecord('blockCheckboxChoice', {
            active: false,
            defaultTrue: false,
            checkboxes: 3,
            block: newBlock,
            formText: ["Option 3"],
            text: "Hi, I'm the text that will display when only checkbox 3 is selected",
          });
          newChoice3.save();
          const newChoice12 = this.get('store').createRecord('blockCheckboxChoice', {
            active: false,
            defaultTrue: false,
            checkboxes: 12,
            block: newBlock,
            formText: ["Option 1", "Option 2"],
            text: "Hi, I'm the text that will display when only checkbox 1 and 2 is selected",
          });
          newChoice12.save();
          const newChoice13 = this.get('store').createRecord('blockCheckboxChoice', {
            active: false,
            defaultTrue: false,
            checkboxes: 13,
            block: newBlock,
            formText: ["Option 1", "Option 3"],
            text: "Hi, I'm the text that will display when only checkbox 1 and 3 is selected",
          });
          newChoice13.save();
          const newChoice23 = this.get('store').createRecord('blockCheckboxChoice', {
            active: false,
            defaultTrue: false,
            checkboxes: 23,
            block: newBlock,
            formText: ["Option 2", "Option 3"],
            text: "Hi, I'm the text that will display when only checkbox 2 and 3 is selected",
          });
          newChoice23.save();
          const newChoice123 = this.get('store').createRecord('blockCheckboxChoice', {
            active: false,
            defaultTrue: false,
            checkboxes: 123,
            block: newBlock,
            formText: ["Option 1", "Option 2", "Option 3"],
            text: "Hi, I'm the text that will display when all three checkboxes are selected",
          });
          newChoice123.save();
        }).then(() => {
          newBlock.save();
        });
      });
  },


  actions: {
    reorderItems(blockModels) {
      blockModels.forEach((block, index) => {
        const newOrderNumber = index + 1;
        block.set('orderNumber', newOrderNumber);
        block.save();
      });
      this.toggleProperty('rebuildText');
      this.toggleProperty('rebuildMenu');
    },
    toggleBlockTab() {
      this.toggleProperty('blocksActive');
    },
    newBlock() {
      $('.ui.block.modal').modal('show');
    },
    openNewStatic() {
      this.set('newBlockMenu', false);
      this.set('newBlockStatic', true);
    },
    openNewToggle() {
      this.set('newBlockMenu', false);
      this.set('newBlockToggle', true);
    },
    openNewCheckbox() {
      this.set('newBlockMenu', false);
      this.set('newBlockCheckbox', true);
    },
    cancelNewBlock() {
      this.set('newBlockMenu', true);
      this.set('newBlockStatic', false);
      this.set('newBlockToggle', false);
      this.set('newBlockCheckbox', false);
      this.set('errorMessage', false);
      this.set('staticText', null);
      this.set('title', null);
      this.set('helpText', null);
      this.set('errors.staticText', false);
    },
    createBlock() {
      if (this.get('newBlockStatic')) {
        this.createStaticBlock();
      } else if (this.get('newBlockToggle')) {
        this.validateToggle();
        if (this.get('hasToggleErrors')) {
          this.set('errorMessage', true);
          return false;
        }
        this.createToggleBlock();
      } else if (this.get('newBlockCheckbox')) {
        this.validateMenuTitle();
        if (this.get('hasMenuTitleErrors')) {
          this.set('errorMessage', true);
          return false;
        }
        this.createCheckboxBlock();
      }

    },


  }
});
