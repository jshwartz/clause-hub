import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    deleteClause(clause) {
      let deletedFavorites = clause.get('favoriteUsers').then((users) => {
        users.map((user) => {
         user.get('favoriteClauses').removeObject(clause);
         return user.save();
       });
      });
      let deletedAdmins = clause.get('adminUsers').then((users) => {
        users.map((user) => {
          user.get('adminClauses').removeObject(clause);
          return user.save();
        });
      });
      let deletedCanReads = clause.get('canReadUsers').then((users) => {
        users.map((user) => {
          user.get('canReadClauses').removeObject(clause);
          return user.save();
        });
      });
      let deletedCanWrites = clause.get('canWriteUsers').then((users) => {
        users.map((user) => {
          user.get('canWriteClauses').removeObject(clause);
          return user.save();
        });
      });
      // let deletedBlocks = clause.get('blocks').then((blocks) => {
      //   blocks.forEach((block) => {
      //     block.destroyRecord();
      //   });
      // });
      let deletions = [deletedFavorites, deletedAdmins, deletedCanReads, deletedCanWrites];
      Ember.RSVP.all(deletions).then(function() {
        clause.get('blocks').then((blocks) => {
          clause.destroyRecord();
          blocks.forEach((block) => {
            block.destroyRecord();
          });
        });
      }).catch(function(errors) {
        console.log(errors);
      });
    }
  }
});
