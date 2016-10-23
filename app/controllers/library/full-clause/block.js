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
    }
  }
});
