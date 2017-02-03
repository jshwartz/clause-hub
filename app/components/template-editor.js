import UiModal from 'semantic-ui-ember/components/ui-modal';

export default UiModal.extend({
  name: 'tempeditor',
  classNames: [ 'large tempeditor' ],
  didRender() {
    $('.ui.tempeditor.modal').modal('show');
  },

  staticText: null,
  options: {
    menubar: false,
    // statusbar: false,
    force_p_newlines : false,
    force_br_newlines : true,
    forced_root_block : "",
    toolbar: 'removeformat bold italic underline strikethrough subscript superscript mergefield',
    plugins: "autolink paste",
    paste_word_valid_elements: "b,strong,i,em,h1,h2",
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

  actions: {
    saveSection() {
      const model = this.get('model');
      model.set('text', model.get('textTemp'));
      model.set('header', model.get('headerTemp'));
      model.set('menuText', model.get('menuTextTemp'));
      model.save().then(() => {
        // this.set('errorMessage', false);
        // this.set('isEditing', false);
        $('.ui.tempeditor.modal').modal('hide');
      }).catch(error => {
        console.error(error);
      });
    },
    closeSection() {
      $('.ui.tempeditor.modal').modal('hide');
    },
    reset() {
      this.resetEditor();
    }
  }
});
