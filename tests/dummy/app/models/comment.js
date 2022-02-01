import Model, { attr } from '@ember-data/model';
import QueryableModelMixin from 'ember-data-has-many-query/mixins/queryable-model';
import belongsToSticky from 'ember-data-has-many-query/belongs-to-sticky';

export default class CommentModel extends Model.extend(QueryableModelMixin) {
  @attr('string') text;
  @belongsToSticky('post', { async: true }) post;
}
