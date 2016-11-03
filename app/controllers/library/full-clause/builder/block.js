import Ember from 'ember';

export default Ember.Controller.extend({
  isEditing: false,
  type: Ember.computed('model', function() {
    const model = this.get('model');
    return model.get('type');
  }),
  staticTrue: Ember.computed.equal('type', "static"),
  dropdownTrue: Ember.computed.equal('type', "dropdown"),
  toggleTrue: Ember.computed.equal('type', "toggle"),
  checkboxTrue: Ember.computed.equal('type', "checkbox"),
  rebuildDropdowns: false,




  actions: {
    editBlock: function() {
      this.set('isEditing', true);
    },

    saveBlock(properties) {
      const model = this.get('model');
      model.setProperties(properties);
      model.save().then(() => {
        this.send('toggleRebuildText');
        this.set('isEditing', false);
      });
    },

    rebuildMenu() {
      this.send('toggleRebuildMenu');
    },

    rebuildText() {
      this.send('toggleRebuildText');
    },
    createNewDropdown(properties) {
      const model = this.get('model');
      const orderNumber = this.get('model.blockDropdowns.length') + 1;
      const newDropdown = this.get('store').createRecord('block-dropdown', {
        menuText: properties.newMenuTitle,
        text: properties.newText,
        defaultTrue: false,
        block: model,
        orderNumber: orderNumber,
      });
      newDropdown.save()
        .then(() => {
          model.save();
        })
        .catch(error => {
          console.error("Error saving player", error);
        });
    },
    deleteDropdown(dropdown) {
      dropdown.destroyRecord().then(() => {
        this.get('model').save();
        this.toggleProperty('rebuildDropdowns');
      });
    }
  }
});
