import Route from '@ember/routing/route';

export default Route.extend({
  model: function (params) {
    const postPromise = this.store.find('post', params.post_id);
    return postPromise.then(function(post) {
      return post.query('comments', {page: params.comments_page});
    });
  }
});
