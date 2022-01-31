import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default Route.extend({
  store: service(),

  model: function (params) {
    const postPromise = this.store.find('post', params.post_id);
    return postPromise.then(function(post) {
      return post.query('comments', {page: params.comments_page});
    });
  }
});
