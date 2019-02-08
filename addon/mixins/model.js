import { next } from '@ember/runloop';
import { Promise } from 'rsvp';
import Mixin from '@ember/object/mixin';
import DS from 'ember-data';
import {
  queryParamPropertyName,
  queryIdPropertyName,
  lastWasErrorPropertyName,
  ajaxOptionsPropertyName,
  stickyPropertyName
} from '../property-names';
import { recordHasId } from '../belongs-to-sticky';

let queryId = 0;

/**
 * Mixin for DS.Model extensions.
 */
export default Mixin.create({
  init() {
    this._super(...arguments);

    // Set sticky properties on init
    this.eachRelationship(key => {
      this._setStickyPropertyForKey(key);
    });
  },

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
   * @returns {Ember.RSVP.Promise}
   */
  query: function (propertyName, params) {
    const self = this;

    //abort the last query request for this property
    const _ajaxOptionsPropertyName = ajaxOptionsPropertyName(propertyName);
    const lastAjaxOptions = this.get(_ajaxOptionsPropertyName);
    if (lastAjaxOptions && lastAjaxOptions.jqXHR) {
      lastAjaxOptions.jqXHR.abort();
    }

    //set the query params as a property on this record
    const _queryParamPropertyName = queryParamPropertyName(propertyName);
    const _queryIdPropertyName = queryIdPropertyName(propertyName);
    const currentQueryId = queryId++;

    const oldParams = this.get(_queryParamPropertyName, params)

    this.set(_queryParamPropertyName, params);
    this.set(_queryIdPropertyName, currentQueryId);

    //get the relationship value, reloading if necessary
    const value = this.reloadRelationship(propertyName, JSON.stringify(params) !== JSON.stringify(oldParams));

    //return the promise, clearing the ajax options property
    return value.catch(function (error) {
      if (error instanceof DS.AbortError) {
        //ignore aborted requests
        return;
      }
      throw error;
    }).finally(function () {
      if (self.get(_queryIdPropertyName) !== currentQueryId) {
        //don't clear parameters if they've been set by another request
        return;
      }
      self.set(_ajaxOptionsPropertyName, undefined);
    });
  },

  /**
   * Get the relationship property for the given property name, reloading the async relationship if necessary.
   *
   * @param propertyName Relationship property name
   * @returns {Ember.RSVP.Promise}
   */
  reloadRelationship: function (propertyName) {
    //find out what kind of relationship this is
    const relationship = this.relationshipFor(propertyName);
    const isHasMany = relationship && relationship.kind === 'hasMany';

    const self = this;
    const reference = isHasMany ? this.hasMany(propertyName) : this.belongsTo(propertyName);
    return new Promise(function (resolve) {
      //run.next, so that aborted promise gets rejected before starting another
      next(this, function () {
        const isLoaded = reference.value() !== null;
        if (isLoaded) {
          resolve(reference.reload());
        } else {
          //isLoaded is false when the last query resulted in an error, so if this load
          //results in an error again, reload the reference to query the server again
          const promise = reference.load().catch(function (error) {
            const _lastWasErrorPropertyName = lastWasErrorPropertyName(propertyName);
            if (self.get(_lastWasErrorPropertyName)) {
              //last access to this property resulted in an error, so reload
              return reference.reload();
            }
            //mark this result as an error for next time the property is queried
            self.set(_lastWasErrorPropertyName, true);
            throw error;
          });
          resolve(promise);
        }
      });
    });
  },

  notifyBelongsToChanged: function (key) {
    //called when a belongsTo property changes
    this._super(...arguments);
    this._setStickyPropertyForKey(key);
  },

  _setStickyPropertyForKey(key) {
    //check if the belongsTo relationship has been marked as sticky
    const meta = this.constructor.metaForProperty(key);
    if (!meta.sticky) {
      return;
    }

    //check if the value is loaded
    const reference = this.belongsTo(key);
    const value = reference && reference.value();
    if (!recordHasId(value) || value.get('isEmpty')) {
      return;
    }

    //if a belongsTo relationship attribute has changed, and the new record has an id,
    //store the record in a property so that the belongsToSticky can return if it required
    this.set(stickyPropertyName(key), value);
  }
});
