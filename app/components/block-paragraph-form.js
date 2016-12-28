import Ember from 'ember';
import clauseUpdate from '../mixins/clauseupdate';

export default Ember.Component.extend(clauseUpdate, {
  isEditing: false,
  staticText: null,
  deleteMessage: false,

  resetBlockData() {
    ['staticText'].forEach((field) => {
      const valueInBlock = this.get('model').get(field);
      this.set(field, valueInBlock);
    });
  },

  actions: {
    saveBlock() {
      const model = this.get('model');
      model.set('staticText', this.get('staticText'));
      model.save().then(() => {
        this.updateLastModified(this.get('model.clause'));
        this.get('rebuildText')();
        this.set('isEditing', false);
      }).catch(error => {
        console.error(error);
      });
    },
    editBlock: function() {
      this.resetBlockData();
      this.set('isEditing', true);
    },
    cancelEditing() {
      this.set('isEditing', false);
    },
    deleteConfirm() {
      this.set('deleteMessage', true);
    },
    cancelDelete() {
      this.set('deleteMessage', false);
    },
    destroyBlock() {
      this.get('destroyBlock')();
      this.updateLastModified(this.get('model.clause'));
    }
  }
});
