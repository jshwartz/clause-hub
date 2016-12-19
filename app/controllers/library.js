import Ember from 'ember';

export default Ember.Controller.extend({
  title: null,
  hasValidTitle: Ember.computed.notEmpty('title'),
  subTitle: null,
  hasValidSubTitle: Ember.computed.notEmpty('subTitle'),
  heading: null,
  hasErrors: Ember.computed('hasValidTitle', 'hasValidSubTitle', function() {
    const hasValidTitle = this.get('hasValidTitle');
    const hasValidSubTitle = this.get('hasValidSubTitle');
    if (hasValidTitle && hasValidSubTitle) {
      return false;
    } else {
      return true;
    }
  }),
  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),

  validate() {
    this.set('errors.subTitle', this.get('hasValidSubTitle') ? null : "Sub-title is required.");
    this.set('errors.title', this.get('hasValidTitle') ? null : "Title is required.");
  },
  resetModal() {
    this.setProperties({ title: null, subTitle: null, heading: null, errorMessage: false});
    this.errors.setProperties({title: null, subTitle: null});
  },

  actions: {
    cancelNewClause() {
      this.resetModal();
    },
    createClause() {
      this.set('clauseIsSaving', true);
      this.validate();
      if (this.get('hasErrors')) {
        this.set('errorMessage', true);
        this.set('clauseIsSaving', false);
        return false;
      }
      const metadata = {
        title: this.get('title'),
        subTitle: this.get('subTitle'),
        heading: this.get('heading'),
        created: new Date(),
        lastModified: new Date(),
      };
      this.get('store').findRecord('user', this.get('session.currentUser.uid')).then((admin) => {
        const newClause = this.get('store').createRecord('clause', {
          metadata: metadata,
        });
        newClause.get('adminUsers').pushObject(admin);
        newClause.save()
          .then(() => {
            admin.save();
            this.set('clauseIsSaving', false);
            this.transitionToRoute('library.fullClause.builder', newClause);
          })
          .catch(error => {
            console.error("Error saving player", error);
          });
      });
    },
    openClauseModal() {
      $('.ui.clause.modal').modal('show');
    }
  }
});
