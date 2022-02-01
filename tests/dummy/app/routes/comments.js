import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CommentsRoute extends Route {
  @service store;

  model({ post_id, comments_page }) {
    const postPromise = this.store.find('post', post_id);
    return postPromise.then((post) => {
      return post.query('comments', { page: comments_page });
    });
  }
}
