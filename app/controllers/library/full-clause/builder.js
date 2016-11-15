import Ember from 'ember';

export default Ember.Controller.extend({
  sortBy: ['orderNumber'],
  sortedBlocks: Ember.computed.sort('model.blocks', 'sortBy'),
  rebuildText: false,
  rebuildMenu: false,
  blocksActive: true,
  newBlockMenu: true,
  newBlockStatic: false,
  newBlockToggle: true,
  staticText: null,
  title: null,
  helpText: null,
  hasValidStaticText: Ember.computed.notEmpty('staticText'),
  hasValidTitle: Ember.computed.notEmpty('title'),
  hasStaticErrors: Ember.computed.not('hasValidStaticText'),
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
    cancelNewBlock() {
      this.set('newBlockMenu', true);
      this.set('newBlockStatic', false);
      this.set('newBlockToggle', false);
      this.set('errorMessage', false);
      this.set('staticText', null);
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
      }

    },


  }
});
