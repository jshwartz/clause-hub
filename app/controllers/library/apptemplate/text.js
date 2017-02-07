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

  organizeLevels() {
    const template = this.get('model');
    const templateSections = this.get('model.sortedSectionsRef');
    const l0sections = [];
    templateSections.forEach((section) => {
      if (section.get('level') === 0) {
        l0sections.addObject(section);
      }
    });
    const l1sections = templateSections.filter((section) => {
      return section.get('level') === 1;
    });
    // organize tempalte sections.
    templateSections.forEach((tsection) => {
      //remove old relationships
      tsection.set('ctemplate', null);
      template.get('csections').removeObject(tsection);
      tsection.set('section', null);
      //add all 0 level sections as template children
      if (tsection.get('level') === 0) {
        template.get('csections').addObject(tsection);
        tsection.set('ctemplate', template);
      //set all 1 level sections
      } else if (tsection.get('level') === 1) {
        let l0sectionsSliced = [];
        l0sections.forEach((l0section) => {
          if (l0section.get('orderNumber') < tsection.get('orderNumber')) {
            l0sectionsSliced.addObject(l0section);
          }
        });
        const lastObject = l0sectionsSliced.get('lastObject');
        lastObject.get('subSections').addObject(tsection);
        tsection.set('section', lastObject);
      } else if (tsection.get('level') === 2) {
        let l1sectionsSliced = [];
        l1sections.forEach((l1section) => {
          if (l1section.get('orderNumber') < tsection.get('orderNumber')) {
            l1sectionsSliced.addObject(l1section);
          }
        });
        const lastObject = l1sectionsSliced.get('lastObject');
        lastObject.get('subSections').addObject(tsection);
        tsection.set('section', lastObject);
      }
      // tsection.save();
    });
  },

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
    closeActiveSection(section) {
      section.set('hoverHighlight', false);
    },
    sendActiveSection(section) {
      section.set('hoverHighlight', true);
    },
    closeActiveMerge() {
      this.set('mergeActive', false);
    },
    sendActiveMerge() {
      this.set('mergeActive', true);
    },
    level0Up(section) {
      if (section.get('noUpLevel')) {
        return false;
      }
      section.set('level', 1);
      this.organizeLevels();
    },
    level1Up(section) {
      if (section.get('noUpLevel')) {
        return false;
      }
      section.set('level', 2);
      this.organizeLevels();
    },
    level1Down(section) {
      section.set('level', 0);
      section.get('subSections').then((subSections) => {
        subSections.forEach((subSection) => {
          subSection.set('level', 1);
        });
        this.organizeLevels();
      });
    },
    level2Down(section) {
      section.set('level', 1);
      this.organizeLevels();
    }
  }
});
