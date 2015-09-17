import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('posts', {path: '/posts'});
  this.route('post', {path: '/posts/:post_id'});
  this.route('comments', {path: '/posts/:post_id/comments/:comments_page'});
});

export default Router;
