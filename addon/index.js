import ModelMixin from './mixins/model';
import RESTAdapterMixin from './mixins/rest-adapter';
import belongsToSticky from './belongs-to-sticky';

const RelationshipQuery = function () {
  this.ModelMixin = ModelMixin;
  this.RESTAdapterMixin = RESTAdapterMixin;
  this.belongsToSticky = belongsToSticky;
};

const relationshipQuery = new RelationshipQuery();

export {ModelMixin, RESTAdapterMixin, belongsToSticky};
export default relationshipQuery;
