import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default Route.extend({
  store: service(),

  model: function() {
    return this.store.findAll('post');
  }
});
