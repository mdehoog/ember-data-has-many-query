import QueryableAdapterMixin from 'ember-data-has-many-query/mixins/queryable-adapter';
import { module, test } from 'qunit';
import Model from '@ember-data/model';

module('Unit | Mixin | queryable-adapter', function () {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let QueryableAdapterObject = class extends Model.extend(
      QueryableAdapterMixin
    ) {};
    assert.ok(QueryableAdapterObject);
  });
});
