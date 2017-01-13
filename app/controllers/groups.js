import Ember from 'ember';

export default Ember.Controller.extend({
  groupIsSaving: false,
  name: null,
  hasValidName: Ember.computed.notEmpty('name'),
  description: null,
  hasValidDescription: Ember.computed.notEmpty('description'),
  hasErrors: Ember.computed('hasValidName', 'hasValidDescription', function() {
    const hasValidName = this.get('hasValidName');
    const hasValidDescription = this.get('hasValidDescription');
    if (hasValidName && hasValidDescription) {
      return false;
    } else {
      return true;
    }
  }),
  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),

  validate() {
    this.set('errors.name', this.get('hasValidName') ? null : "Name is required.");
    this.set('errors.description', this.get('hasValidDescription') ? null : "Description is required.");
  },
  resetModal() {
    this.setProperties({ name: null, description: null, errorMessage: false});
    this.errors.setProperties({name: null, description: null});
  },

  actions: {
    cancelNewGroup() {
      this.resetModal();
    },
    openUserGroupModal() {
      $('.ui.user-group.modal').modal('show');
    },
    createGroup() {
      this.set('groupIsSaving', true);
      const user = this.get('model');
      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        this.set('groupIsSaving', false);
        return false;
      }
      const newGroup = this.get('store').createRecord('group', {
        name: this.get('name'),
        description: this.get('description'),
      });
      newGroup.get('managers').pushObject(user);
      newGroup.save().then(() => {
        user.save();
        this.set('groupIsSaving', false);
        this.transitionToRoute('group', newGroup);
      }).catch(error => {
        console.error(error);
      });
    }
  }

});
