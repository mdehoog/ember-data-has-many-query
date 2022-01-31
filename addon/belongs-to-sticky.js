import { computed } from '@ember/object';
import { belongsTo } from '@ember-data/model';
import { stickyPropertyName } from './property-names';

const recordHasId = function (record) {
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
const belongsToSticky = function () {
  let _computed = belongsTo(...arguments);
  let meta = _computed.meta();
  meta.sticky = true;
  return computed({
    get: function (key) {
      let value = _computed._getter.call(this, ...arguments);
      if (recordHasId(value)) {
        return value;
      }
      return this.get(stickyPropertyName(key)) || value;
    },
    set: function (key) {
      this.set(stickyPropertyName(key), undefined);
      return _computed._setter.call(this, ...arguments);
    },
  }).meta(meta);
};

export { recordHasId };
export default belongsToSticky;
