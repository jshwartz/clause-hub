import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    openEditor: function() {
      $('.ui.tempeditor.modal').modal('show');
    },
    backToTemplate() {
      const model = this.get('model');
      model.set('textTemp', model.get('text'));
      model.set('headerTemp', model.get('header'));
      model.set('menuTextTemp', model.get('menuText'));
      this.transitionToRoute('library.apptemplate.text', this.get('model.ctemplateRef'));
    }
  }

});
