import DS from 'ember-data';
import QueryableAdapterMixin from 'ember-data-has-many-query/mixins/queryable-adapter';
import { module, test } from 'qunit';

module('Unit | Mixin | queryable-adapter', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let QueryableAdapterObject = DS.Model.extend(QueryableAdapterMixin);
    assert.ok(QueryableAdapterObject);
  });
});
