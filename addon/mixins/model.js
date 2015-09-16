import Ember from 'ember';
import DS from 'ember-data';
import { queryParamPropertyName, stickyPropertyName } from '../property-names';
import { recordHasId } from '../belongs-to-sticky';

/**
 * Mixin for DS.Model extensions.
 */
export default Ember.Mixin.create({
  /**
   * Query a HasMany relationship link.
   *
   * If you do something like this:
   * ```javascript
   * post.query('comments', { page: 1 });
   * ```
   *
   * The call made to the server will look something like this:
   * ```
   * Started GET "/api/v1/post/1/comments?page=1"
   * ```
   *
   * @param {String} propertyName HasMany property name
   * @param {Object} params Query parameters
   * @returns {DS.PromiseManyArray}
   */
  query: function (propertyName, params) {
    var self = this;

    //set the query params as a property on this record
    var _queryParamPropertyName = queryParamPropertyName(propertyName);
    this.set(_queryParamPropertyName, params);

    //retrieve the hasMany relationship
    var value = this.get(propertyName);

    //if the hasMany content is already loaded, we must reload it
    if (value.get('content').get('isLoaded')) {
      value = value.reload();
    }

    //return the promise, resetting the query params property to undefined
    return value.finally(function () {
      self.set(_queryParamPropertyName, undefined);
    });
  },

  notifyBelongsToChanged: function (key) {
    //called when a belongsTo property changes
    this._super(...arguments);

    //if a belongsTo relationship attribute has changed, and the new record has an id,
    //store the record in a property so that the belongsToSticky can return if it required
    var value = this.get(key);
    if (recordHasId(value)) {
      var meta = this.constructor.metaForProperty(key);
      if (meta.notNull) {
        this.set(stickyPropertyName(key), value);
      }
    }
  }
});
