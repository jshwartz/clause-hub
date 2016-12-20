import Ember from 'ember';
import ClauseUpdateMixin from 'clause-hub/mixins/clause-update';
import { module, test } from 'qunit';

module('Unit | Mixin | clause update');

// Replace this with your real tests.
test('it works', function(assert) {
  let ClauseUpdateObject = Ember.Object.extend(ClauseUpdateMixin);
  let subject = ClauseUpdateObject.create();
  assert.ok(subject);
});
