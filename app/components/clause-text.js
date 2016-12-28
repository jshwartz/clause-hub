import Ember from 'ember';

export default Ember.Component.extend({
  sortBy: ['order'],
  activeBlock: null,
  copyText: null,
  // extract selected clause text into array
  textArray: Ember.computed('rebuildText', 'activeBlock', function() {
    const activeBlock = this.get('activeBlock');
    let result = [];
    this.get('model.blocks').then(function(blocks){
      blocks.forEach( (block) => {
        const type = block.get('type');
        const orderNumber = block.get('orderNumber');
        const selectedText = block.get('selectedText');
        let highlightBlock = false;
        if (activeBlock === block.get('id')) {
          highlightBlock = true;
        }
        let text = '';
        if (selectedText !== null) {
          if (highlightBlock) {
            text = "<span class='text-highlight'>" + selectedText + "</span>";
            result.addObject({order: orderNumber, text: text, paragraph: false});
          } else if (type === "paragraph") {
            text = "</p><p><em>" + selectedText + ".</em>";
            result.addObject({order: orderNumber, text: text, paragraph: true});
          } else {
            text = selectedText;
            result.addObject({order: orderNumber, text: text, paragraph: false});
          }
        } else if (type === "paragraph" && selectedText === null) {
          text = "</p><p>";
          result.addObject({order: orderNumber, text: text, paragraph: true});
        }
      });
    });
    return result;
  }),
  // sort final text array
  sortedTextArray: Ember.computed.sort('textArray', 'sortBy'),
  // build final text block
  finalText: Ember.computed('sortedTextArray', function() {
    const sortedBlockArray = this.get('sortedTextArray');
    let resultArray = [];
    sortedBlockArray.forEach((block, index) => {
      if (block.paragraph) {
        const nextBlock = sortedBlockArray.objectAt(index + 1);
        if (!nextBlock.paragraph) {
          resultArray.pushObject(block.text);
        }
      } else {
        resultArray.pushObject(block.text);
      }
    });
    resultArray.push("</p>");
    if (this.get('model.metadata.header')) {
      resultArray.unshift("<p><strong>" + this.get('model.metadata.header') + ".</strong>");
    } else {
      resultArray.unshift("<p>");
    }
    return resultArray.join(' ');
  }),
});
