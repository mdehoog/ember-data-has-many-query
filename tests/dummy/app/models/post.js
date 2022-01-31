import DS from 'ember-data';
import QueryableModelMixin from 'ember-data-has-many-query/mixins/queryable-model';

export default DS.Model.extend(QueryableModelMixin, {
  text: DS.attr('string'),
  comments: DS.hasMany('comment', {async: true})
});
