# ember-data-has-many-query
[![Build Status](https://travis-ci.org/mdehoog/ember-data-has-many-query.svg?branch=master)](https://travis-ci.org/mdehoog/ember-data-has-many-query) [![Ember Observer Score](http://emberobserver.com/badges/ember-data-has-many-query.svg)](http://emberobserver.com/addons/ember-data-has-many-query)

[Ember Data](https://github.com/emberjs/data)'s `DS.Store` supports querying top-level records using the
[`query`](http://emberjs.com/api/data/classes/DS.Store.html#method_query) function. This provides support
for things like pagination and searching.

However, `DS.hasMany` and `DS.belongsTo` cannot be queried in the same way. This means pagination and searching are not
supported with has-many/belongs-to relationships.

This addon provides a way to query has-many and belongs-to relationships. Currently the `DS.RESTAdapter` and the
`DS.JSONAPIAdapter` are supported.

## Compatibility

* Ember.js v3.24 or above
* Ember CLI v3.24 or above
* Node.js v12 or above


## Installation

`ember install ember-data-has-many-query`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

## Usage

Add the `RESTAdapterMixin` to your `DS.RESTAdapter` (or `DS.JSONAPIAdapter`) extension:

```javascript
import QueryableAdapterMixin from 'ember-data-has-many-query/mixins/queryable-adapter';

export default DS.RESTAdapter.extend(QueryableAdapterMixin, {
});
```

Add the `ModelMixin` to any `DS.Model` extensions:

```javascript
import QueryableModelMixin from 'ember-data-has-many-query/mixins/queryable-model';

export default DS.Model.extend(QueryableModelMixin, {
});
```

Models with the mixin now support has-many/belongs-to queries:

```javascript
post.query('comments', { page: 1 });
```

## Sticky `belongs-to`

Ember Data 2.3.x and below: each has-many query calls `reload` on the relationship's `DS.ManyArray`. This means that all previously
queried records are cleared from the array. If you are caching the records from each query separately
(for example, in a separate array for an infinite scroll implementation), the inverse `belongs-to`
relationship is also cleared on those cached records.

If you want to keep the associated belongs-to record after a new query, you can define the belongs-to
attribute using `belongsToSticky`:

```javascript
import QueryableModelMixin from 'ember-data-has-many-query/mixins/queryable-model';
import belongsToSticky from 'ember-data-has-many-query/belongs-to-sticky';

export default DS.Model.extend(QueryableModelMixin, {
  post: belongsToSticky('post'),
});
```

This is a (pretty terrible) hack that caches the belongs-to record in a separate property, and when the
record is cleared by another query call, any property `get`s will return the cached version instead. If
anyone has ideas for better implementations, please let me know!


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
