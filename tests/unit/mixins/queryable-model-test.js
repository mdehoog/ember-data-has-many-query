import DS from 'ember-data';
import QueryableModelMixin from 'ember-data-has-many-query/mixins/queryable-model';
import { module, test } from 'qunit';

module('Unit | Mixin | queryable-model', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let QueryableModelObject = DS.Model.extend(QueryableModelMixin);
    assert.ok(QueryableModelObject);
  });
});
