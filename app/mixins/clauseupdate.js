import Ember from 'ember';

export default Ember.Mixin.create({
  user: Ember.inject.service(),
  store: Ember.inject.service(),

  updateLastModified(clause1) {
    this.get('store').findRecord('clause', clause1.get('id')).then((clause) => {
      this.get('user.currentUser').then((user) => {
        clause.set('metadata.lastModifiedBy', user.get('fullName'));
        clause.set('metadata.lastModified', new Date());
        clause.save();
      });
    });
  }

});
