import Ember from 'ember';

export default Ember.Controller.extend({
  sortBy: ['orderNumber'],
  sortedBlocks: Ember.computed.sort('model.blocks', 'sortBy'),
  rebuildText: false,
  rebuildMenu: false,
  blocksActive: true,
  newBlockMenu: true,
  newBlockStatic: false,

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
    }

  }
});
