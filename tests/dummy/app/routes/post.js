import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PostRoute extends Route {
  @service store;

  model({ post_id }) {
    return this.store.find('post', post_id);
  }
}
