import Ember from 'ember';
import { queryParamPropertyName, stickyPropertyName } from '../property-names';
import { recordHasId } from '../belongs-to-sticky';

/**
 * Mixin for DS.Model extensions.
 */
export default Ember.Mixin.create({
  /**
   * Query a HasMany/BelongsTo relationship link.
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
   * @param {String} propertyName Relationship property name
   * @param {Object} params Query parameters
   * @returns {DS.PromiseManyArray} for HasMany, {Ember.RSVP.Promise} for BelongsTo
   */
  query: function (propertyName, params) {
    var self = this;

    //set the query params as a property on this record
    var _queryParamPropertyName = queryParamPropertyName(propertyName);
    this.set(_queryParamPropertyName, params);

    //get the relationship value, reloading if necessary
    var value = this.reloadRelationship(propertyName);

    //return the promise, resetting the query params property to undefined
    return value.finally(function () {
      self.set(_queryParamPropertyName, undefined);
    });
  },

  /**
   * Get the relationship property for the given property name, reloading the async relationship if necessary.
   *
   * @param propertyName Relationship property name
   * @returns {DS.PromiseManyArray} for HasMany, {Ember.RSVP.Promise} for BelongsTo
   */
  reloadRelationship: function (propertyName) {
    //find out what kind of relationship this is
    var relationshipsByName = this.get('constructor.relationshipsByName');
    var relationship = relationshipsByName && relationshipsByName.get(propertyName);
    var isBelongsTo = relationship && relationship.kind === 'belongsTo';
    var isHasMany = relationship && relationship.kind === 'hasMany';

    //setting the linkPromise in the internal belongsTo relationship forces the belongsTo record to reload
    if (isBelongsTo) {
      var internalRelationship = this._internalModel._relationships.get(propertyName);
      internalRelationship.linkPromise = null;
      //also notify a property change, to clear the record from the computed property cache
      this.notifyPropertyChange(propertyName);
    }

    //retrieve the relationship
    var value = this.get(propertyName);

    //if the hasMany relationship content is already loaded, we must reload it
    if (isHasMany && value.get('content.isLoaded')) {
      value = value.reload();
    }

    return value;
  },

  notifyBelongsToChanged: function (key) {
    //called when a belongsTo property changes
    this._super(...arguments);

    //if a belongsTo relationship attribute has changed, and the new record has an id,
    //store the record in a property so that the belongsToSticky can return if it required
    var value = this.get(key);
    if (recordHasId(value)) {
      var meta = this.constructor.metaForProperty(key);
      if (meta.sticky) {
        this.set(stickyPropertyName(key), value);
      }
    }
  }
});
