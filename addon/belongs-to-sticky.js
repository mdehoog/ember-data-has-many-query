import Ember from 'ember';
import DS from 'ember-data';
import { stickyPropertyName } from './property-names';

var recordHasId = function (record) {
  return record && record.get('id');
};

/**
 * Create an extension to the `DS.belongsTo` computed property that returns a cached
 * record if the current associated belongsTo record doesn't have an id.
 *
 * This may be useful if querying a hasMany relationship multiple times and storing
 * the results, as each query will reset the ManyArray and therefore remove the inverse
 * belongsTo association. Defining a relationship as `belongsToSticky` will keep the
 * associated record even if it is removed from the ManyArray.
 *
 * @returns {Ember.computed} relationship
 */
var belongsToSticky = function () {
  var computed = DS.belongsTo(...arguments);
  var meta = computed.meta();
  meta.sticky = true;
  return Ember.computed({
    get: function (key) {
      var value = computed._getter.call(this, ...arguments);
      if (recordHasId(value)) {
        return value;
      }
      return this.get(stickyPropertyName(key)) || value;
    },
    set: function (key) {
      this.set(stickyPropertyName(key), undefined);
      return computed._setter.call(this, ...arguments);
    }
  }).meta(meta);
};

export { recordHasId };
export default belongsToSticky;
