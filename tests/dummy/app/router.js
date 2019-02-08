import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('posts', {path: '/posts'});
  this.route('post', {path: '/posts/:post_id'});
  this.route('comments', {path: '/posts/:post_id/comments/:comments_page'});
});

export default Router;
