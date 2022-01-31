import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default Route.extend({
  store: service(),

  model: function(params) {
    return this.store.find('post', params.post_id);
  }
});
