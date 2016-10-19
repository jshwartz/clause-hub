import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('block-dropdown-form', 'Integration | Component | block dropdown form', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{block-dropdown-form}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#block-dropdown-form}}
      template block text
    {{/block-dropdown-form}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
