import DS from 'ember-data';
import QueryableModelMixin from 'ember-data-has-many-query/mixins/queryable-model';
import belongsToSticky from 'ember-data-has-many-query/belongs-to-sticky';

export default DS.Model.extend(QueryableModelMixin, {
  text: DS.attr('string'),
  post: belongsToSticky('post', { async: true })
});
