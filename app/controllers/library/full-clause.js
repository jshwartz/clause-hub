import Ember from 'ember';

export default Ember.Controller.extend({
  firstBlock: null,
  firstBlockChanged: Ember.observer('model.blocks.@each.orderNumber', function() {
    if (this.get("model.blocks.length") > 0) {
      console.log(1);
      this.get('model.blocks').then((blocks) => {
        console.log(2);
        blocks.forEach((block) => {
          if (block.get('orderNumber') === 1) {
            this.set('firstBlock', block);
          }
        });
      });
    } else {
      this.set('firstBlock', null);
    }
  }),
  currentBlock: null,
  currentUser: Ember.computed('session.currentUser.uid', function() {
    return this.get('session.currentUser.uid');
  }),
  adminUser123: null,
  userAdmin:  Ember.computed('model', 'currentUser', function() {
    const currentUser = this.get('currentUser');
    const adminUsers = this.get('model.adminUsers');
    let result = false;
    if (!currentUser) {
      return result;
    }
    adminUsers.forEach((user) => {
      if (user.id === currentUser) {
        result = true;
      }
    });
    return result;

  }),
  userCanWrite: Ember.computed('model', 'currentUser', function() {
    const currentUser = this.get('currentUser');
    const clauseWriteUsers = this.get('model.canWriteUsers');
    let result = false;
    if (!currentUser) {
      return result;
    }
    clauseWriteUsers.forEach((clauseUser) => {
      if (clauseUser.id === currentUser) {
        result = true;
      }
    });
    return result;
  }),

  actions: {
    goback() {
      history.back();
    },
    gotoCurrentBlock() {
      const firstBlock = this.get('firstBlock');
      const clause = this.get('model');
      if (firstBlock) {
        this.transitionToRoute('library.fullClause.builder.block', clause, firstBlock);
      } else {
        this.transitionToRoute('library.fullClause.builder', clause);
      }
    },

  }


});
