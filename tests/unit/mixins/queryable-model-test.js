import QueryableModelMixin from 'ember-data-has-many-query/mixins/queryable-model';
import { module, test } from 'qunit';
import Model from '@ember-data/model';

module('Unit | Mixin | queryable-model', function () {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let QueryableModelObject = class extends Model.extend(
      QueryableModelMixin
    ) {};
    assert.ok(QueryableModelObject);
  });
});
