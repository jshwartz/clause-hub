import Ember from 'ember';

export default Ember.Controller.extend({
  party1: "Company, LLC",
  party1focusedText: Ember.computed('party1', function(){
    const party1 = this.get('party1');
    return "<span class='focusedTerm'>" + party1 + "</span>";
  }),
  party1focused: false,
  party1Generic: "Company",
  party1GenericfocusedText: Ember.computed('party1Generic', function(){
    const party1Generic = this.get('party1Generic');
    return "<span class='focusedTerm'>" + party1Generic + "</span>";
  }),

  actions: {
    newSection() {
      this.set('model.mergeFields', [
        {name: "<<Party1>>", mergeValue: "Party 1"},
        {name: "<<Party2>>", mergeValue: "Party 2"}
      ]);
      this.get('model').save();
    },
    focused1() {
      this.set('party1focused', true);
    },
    blue1() {
      this.set('party1focused', false);
    },
    focused2() {
      this.set('party1Genericfocused', true);
    },
    blue2() {
      this.set('party1Genericfocused', false);
    },
    closeActiveSection() {
      this.set('disclaimerActive', false);
    },
    sendActiveSection() {
      this.set('disclaimerActive', true);
    },
    closeActiveMerge() {
      this.set('mergeActive', false);
    },
    sendActiveMerge() {
      this.set('mergeActive', true);
    }
  }
});
