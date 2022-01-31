import Model, { attr, hasMany } from '@ember-data/model';
import QueryableModelMixin from 'ember-data-has-many-query/mixins/queryable-model';

export default class CommentModel extends Model.extend(QueryableModelMixin) {
  @attr('string') text;
  @hasMany('comment', { async: true }) comments;
}
