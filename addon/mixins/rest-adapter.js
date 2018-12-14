import { assign } from '@ember/polyfills';
import { copy } from '@ember/object/internals';
import Mixin from '@ember/object/mixin';
import { isNone, isEmpty } from '@ember/utils';
import { isArray } from '@ember/array';
import {
  queryParamPropertyName,
  ajaxOptionsPropertyName
} from '../property-names';

const evaluateFunctions = function (object, record) {
  if (isArray(object)) {
    object.forEach(function (element) {
      if (typeof element === 'object') {
        evaluateFunctions(element, record);
      }
    });
  } else if (!isNone(object)) {
    Object.keys(object).forEach(function (key) {
      if (!object.hasOwnProperty(key)) {
        return;
      }
      const value = object[key];
      if (typeof value === 'function') {
        object[key] = value.apply(record);
      } else if (typeof value === 'object') {
        evaluateFunctions(value, record);
      }
    });
  }
};

/**
 * Mixin for DS.RESTAdapter.
 */
export default Mixin.create({
  findHasMany: function (store, snapshot, url, relationship) {
    const id = snapshot.id;
    const type = snapshot.modelName;

    url = this.urlPrefix(url, this.buildURL(type, id, null, 'findHasMany'));
    const query = this.buildRelationshipQuery(snapshot, relationship);

    const options = {data: query};
    snapshot.record.set(ajaxOptionsPropertyName(relationship.key), options);
    return this.ajax(url, 'GET', options);
  },
  findBelongsTo: function (store, snapshot, url, relationship) {
    const id = snapshot.id;
    const type = snapshot.modelName;

    url = this.urlPrefix(url, this.buildURL(type, id, null, 'findBelongsTo'));
    const query = this.buildRelationshipQuery(snapshot, relationship);

    const options = {data: query};
    snapshot.record.set(ajaxOptionsPropertyName(relationship.key), options);
    return this.ajax(url, 'GET', options);
  },
  buildRelationshipQuery: function (snapshot, relationship) {
    let data = {};

    //add query parameters from the model mixin's query function
    const queryParams = snapshot.record.get(queryParamPropertyName(relationship.key));
    if (!isEmpty(queryParams)) {
      data = copy(queryParams, true);
    }

    //add query parameters defined in the model itself by the 'parameters' option
    const relationshipParams = relationship.options.parameters;
    if (!isEmpty(relationshipParams)) {
      assign(data, relationshipParams);
    }

    //replace any functions in the data with their return value
    evaluateFunctions(data, snapshot.record);
    return data;
  },
  ajaxOptions: function () {
    const ajaxOptions = this._super(...arguments);
    const defaultBeforeSend = ajaxOptions.beforeSend || function () {
    };
    ajaxOptions.beforeSend = function (jqXHR) {
      defaultBeforeSend(...arguments);
      //store the jqXHR in the options object, which in turn is stored in the model itself, so the model mixin can abort it
      ajaxOptions.jqXHR = jqXHR;
    };
    return ajaxOptions;
  }
});
