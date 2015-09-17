import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    var postPromise = this.store.find('post', params.post_id);
    return postPromise.then(function(post) {
      return post.query('comments', {page: params.comments_page});
    });
  }
});
