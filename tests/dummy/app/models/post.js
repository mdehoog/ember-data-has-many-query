import DS from 'ember-data';
import HasManyQuery from 'ember-data-has-many-query';

export default DS.Model.extend(HasManyQuery.ModelMixin, {
  text: DS.attr('string'),
  comments: DS.hasMany('comment', {async: true})
});
