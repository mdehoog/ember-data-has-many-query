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
    url = this.urlQuerySuffix(snapshot, url, relationship);

    return this.ajax(url, 'GET');
  },
  findBelongsTo: function (store, snapshot, url, relationship) {
    var id = snapshot.id;
    var type = snapshot.modelName;

    url = this.urlPrefix(url, this.buildURL(type, id, null, 'findBelongsTo'));
    url = this.urlQuerySuffix(snapshot, url, relationship);

    return this.ajax(url, 'GET');
  },
  urlQuerySuffix: function (snapshot, url, relationship) {
    var queryParamStrings = [];

    //function that adds a key=value query param to the array
    var addQueryParam = function (key, value) {
      if (Ember.isEmpty(value)) {
        return;
      }
      if (typeof value === 'function') {
        //use the function's return value as the query param value, using the record as 'this'
        addQueryParam(key, value.apply(snapshot.record));
      } else if (typeof value === 'object') {
        // if value is an array send data as ...?params[]=1&params[]=2...
        if (Ember.isArray(value)) {
          value.forEach(function (subValue) {
            if (!Ember.isEmpty(subValue)) {
              addQueryParam(key + '[]', subValue);
            }
          });
        } else {
          //recurse, adding subkeys in square brackets
          Object.keys(value).forEach(function (subKey) {
            var subValue = value[subKey];
            if (!Ember.isEmpty(subValue)) {
              addQueryParam(key + '[' + subKey + ']', subValue);
            }
          });
        }
      } else {
        //add the encoded query parameter key=value
        queryParamStrings.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    };

    //add query parameters from the model mixin's query function
    var queryParams = snapshot.record.get(queryParamPropertyName(relationship.key));
    if (!Ember.isEmpty(queryParams)) {
      Object.keys(queryParams).forEach(function (key) {
        addQueryParam(key, queryParams[key]);
      });
    }

    //add query parameters defined in the model itself by the 'parameters' option
    var relationshipParams = relationship.options.parameters;
    if (!Ember.isEmpty(relationshipParams)) {
      Object.keys(relationshipParams).forEach(function (key) {
        addQueryParam(key, relationshipParams[key]);
      });
    }

    //append the query parameters to the url
    if (queryParamStrings.length) {
      url += (url.indexOf('?') < 0 ? '?' : '&') + queryParamStrings.join('&');
    }
    return url;
  }
});
