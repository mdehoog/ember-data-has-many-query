import Ember from 'ember';
import { queryParamPropertyName } from '../property-names';

/**
 * Mixin for DS.RESTAdapter.
 */
export default Ember.Mixin.create({
  findHasMany: function (store, snapshot, url, relationship) {
    var id = snapshot.id;
    var type = snapshot.modelName;

    url = this.urlPrefix(url, this.buildURL(type, id, null, 'findHasMany'));

    //append query params to hasMany URL
    var queryParams = snapshot.record.get(queryParamPropertyName(relationship.key));
    if (!Ember.isEmpty(queryParams)) {
      var queryParamStrings = [];
      Object.keys(queryParams).forEach(function (key) {
        var value = queryParams[key];
        if (!Ember.isEmpty(value)) {
          queryParamStrings.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
      });
      if (queryParamStrings.length) {
        url += (url.indexOf('?') < 0 ? '?' : '&') + queryParamStrings.join('&');
      }
    }

    return this.ajax(url, 'GET');
  }
});
