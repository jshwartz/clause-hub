import Ember from 'ember';

export default Ember.Controller.extend({
  sortBy: ['orderNumber'],
  sortedBlocks: Ember.computed.sort('model.blocks', 'sortBy'),
  rebuildText: false,
  rebuildMenu: false,
  blocksActive: true,
  newBlockMenu: true,
  newBlockStatic: false,
  staticText: null,
  hasValidStaticText: Ember.computed.notEmpty('staticText'),
  hasErrors: Ember.computed.not('hasValidStaticText'),
  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),

  validate() {
    this.set('errors.staticText', this.get('hasValidStaticText') ? null : "In a static block, text is required.");
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
    cancelNewBlock() {
      this.set('newBlockMenu', true);
      this.set('newBlockStatic', false);
      this.set('errorMessage', false);
      this.set('staticText', null);
      this.set('errors.staticText', false);
    },
    createBlock() {
      this.validate();
      if (this.get('hasErrors')) {
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

    }

  }
});
