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
    var query = this.buildRelationshipQuery(snapshot, relationship);

    return this.ajax(url, 'GET', {data: query});
  },
  findBelongsTo: function (store, snapshot, url, relationship) {
    var id = snapshot.id;
    var type = snapshot.modelName;

    url = this.urlPrefix(url, this.buildURL(type, id, null, 'findBelongsTo'));
    var query = this.buildRelationshipQuery(snapshot, relationship);

    return this.ajax(url, 'GET', {data: query});
  },
  buildRelationshipQuery: function (snapshot, relationship) {
    var evaluateFunctions = function (object) {
      Object.keys(object).forEach(function (key) {
        var value = object[key];
        if (typeof value === 'function') {
          object[key] = value.apply(snapshot.record);
        } else if (typeof value === 'object') {
          evaluateFunctions(value);
        }
      });
    };

    var data = {};

    //add query parameters from the model mixin's query function
    var queryParams = snapshot.record.get(queryParamPropertyName(relationship.key));
    if (!Ember.isEmpty(queryParams)) {
      data = jQuery.extend(true, data, queryParams);
    }

    //add query parameters defined in the model itself by the 'parameters' option
    var relationshipParams = relationship.options.parameters;
    if (!Ember.isEmpty(relationshipParams)) {
      data = jQuery.extend(true, data, relationshipParams);
    }

    //replace any functions in the data with their return value
    evaluateFunctions(data);
    return data;
  }
});
