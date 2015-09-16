import ModelMixin from './mixins/model';
import RESTAdapterMixin from './mixins/rest-adapter';
import belongsToSticky from './belongs-to-sticky';

var HasManyQuery = function () {
  this.ModelMixin = ModelMixin;
  this.RESTAdapterMixin = RESTAdapterMixin;
  this.belongsToSticky = belongsToSticky;
};

var hasManyQuery = new HasManyQuery();

export { ModelMixin, RESTAdapterMixin, belongsToSticky };
export default hasManyQuery;
