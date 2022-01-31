import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('posts', {path: '/posts'});
  this.route('post', {path: '/posts/:post_id'});
  this.route('comments', {path: '/posts/:post_id/comments/:comments_page'});
});
