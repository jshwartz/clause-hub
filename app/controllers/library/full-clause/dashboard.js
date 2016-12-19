import Ember from 'ember';

export default Ember.Controller.extend({
  dashboardClause: "dashboard-clause-big",
  copyText: "hi",

  actions: {
    dashboardClauseBig() {
      this.set('dashboardClause', "dashboard-clause-big");
    },
    dashboardClauseSmall() {
      this.set('dashboardClause', "dashboard-clause-small");
    },
    updateCopyText(value) {
      this.set('copyText', value);
      console.log(value);
    },
    success() {
      alert('Copied!');
    }
  }

});
