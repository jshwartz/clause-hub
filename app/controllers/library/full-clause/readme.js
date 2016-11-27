import Ember from 'ember';

export default Ember.Controller.extend({
  isEditing: false,
  readmeTemp: null,
  editMessage: true,

  actions: {
    openEdit() {
      this.set('isEditing', true);
      this.set('readmeTemp', this.get('model.readmeMD'));
    },
    cancelEdit() {
      this.set('isEditing', false);
      this.set('readmeTemp', null);
    },
    saveReadme() {
      const readmeTemp = this.get('readmeTemp');
      const model = this.get('model');
      model.set('readmeMD', readmeTemp);
      model.save().then(() => {
        this.set('isEditing', false);
        this.set('readmeTemp', null);
      });
    },
    closeEditMessage() {
      this.set('editMessage', false);
    }
  },
});
