import Ember from 'ember';

export default Ember.Component.extend({
  isEditing: false,
  staticText: null,
  options: {
    menubar: false,
    statusbar: false,
    force_p_newlines : false,
    forced_root_block : '',
    toolbar: 'undo redo | removeformat | bold italic underline strikethrough | subscript superscript | mergefield',
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
      editor.addButton('mergefield', {
        type: 'menubutton',
        text: 'Merge Fields',
        tooltip: "Insert Merge Field",
        menu: [{
          text: '@@Party1',
          onclick: function() {
            editor.insertContent('@@Party1');
          }
        }, {
          text: '@@Party2',
          onclick: function() {
            editor.insertContent('@@Party2');
          }
        }]
      });
    }
  },

  resetEditor() {
    this.set('staticText', this.get('model.text'));
  },

  actions: {
    editorOn() {
      this.resetEditor();
      this.set('isEditing', true);
    },
    editorOff() {
      this.set('isEditing', false);
    },
    saveStatic() {
      // this.validate();
      // if (this.get('hasErrors')) {
      //   this.set('errorMessage', true);
      //   return false;
      // }
      const model = this.get('model');
      model.set('text', this.get('staticText'));
      model.save().then(() => {
        // this.set('errorMessage', false);
        this.set('isEditing', false);
      }).catch(error => {
        console.error(error);
      });
    },
  }
});
