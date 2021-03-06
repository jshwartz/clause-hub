import Ember from 'ember';

export default Ember.Controller.extend({
  isEditing: false,
  readmeTemp: null,
  editMessage: true,
  newTagButton: false,
  selectedTag: null,
  selectedTagId: null,
  tags: null,
  fullClauseController: Ember.inject.controller('library.fullClause'),
  currentUser: Ember.computed.reads('fullClauseController.currentUser'),
  userCanWrite: Ember.computed.reads('fullClauseController.userCanWrite'),
  userAdmin: Ember.computed.reads('fullClauseController.userAdmin'),
  userCanEditReadme: Ember.computed.or('userCanWrite', 'userAdmin'),
  options: {
    height: 500,
    visual: true,
    toolbar: 'undo redo | currentdate',
    plugins: "autolink",
    content_css : '/assets/vendor.css',
    setup: function(editor) {
      function toTimeHtml(date) {
        return '<time datetime="' + date.toString() + '">' + date.toDateString() + '</time>';
      }
      function insertDate() {
        var html = toTimeHtml(new Date());
        editor.insertContent(html);
      }
      editor.addButton('currentdate', {
        icon: 'insertdatetime',
        //image: 'http://p.yusukekamiyamane.com/icons/search/fugue/icons/calendar-blue.png',
        tooltip: "Insert Current Date",
        onclick: insertDate
      });
    }
  },

  init() {
    let tags = this.store.findAll('tag');
    this.set('tags', tags);
  },

  actions: {
    openEdit() {
      this.set('isEditing', true);
      this.set('readmeTemp', this.get('model.readme'));
    },
    cancelEdit() {
      this.set('isEditing', false);
      this.set('readmeTemp', null);
    },
    saveReadme() {
      const readmeTemp = this.get('readmeTemp');
      const model = this.get('model');
      this.get('store').findRecord('user', this.get('currentUser')).then((user) => {
        model.set('metadata.lastModifiedBy', user.get('fullName'));
        model.set('readme', readmeTemp);
        model.set('metadata.lastModified', new Date());
        model.save().then(() => {
          this.set('isEditing', false);
          this.set('readmeTemp', null);
      });
      //model.set('metadata.lastModifiedBy', this.get('currentUser.fullName'));
      });
    },
    closeEditMessage() {
      this.set('editMessage', false);
    },
    showNewTag() {
      this.set('newTagButton', true);
    },
    resetTagDropdown() {
      this.set('newTagButton', false);
    },
    createTag() {
      const model = this.get('model');
      const selectedTag = this.get('selectedTag');
      const newTag = this.get('store').createRecord('tag', {
        name: selectedTag,
      });
      newTag.get('clauses').pushObject(model);
      newTag.save().then(() => {
        model.save();
        this.set('selectedTag', null);
        this.set('selectedTagId', null);
      });
    },
    removeTag(tag) {
      const model = this.get('model');
      model.get('tags').removeObject(tag);
      model.save().then(() => tag.save());
    },
    addTag() {
      const tagID = this.get('selectedTagId');
      const model = this.get('model');
      this.get('store').findRecord('tag', tagID ).then((foundTag) => {
        model.get('tags').pushObject(foundTag);
        model.save().then(() => {
          foundTag.save();
          this.set('selectedTag', null);
          this.set('selectedTagId', null);
        });
      });

    },
    handleTagDropdown(id, name) {
      this.set('selectedTag', name);
      this.set('selectedTagId', id);
    }
  },
});
