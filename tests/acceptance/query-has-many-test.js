import Ember from 'ember';
import DS from 'ember-data';
import { module, test } from 'qunit';
import setupStore from '../helpers/setup-store';
import async from '../helpers/async';
import HasManyQuery from 'ember-data-has-many-query';

var env, adapter, store;
var Post, Comment;

module('Acceptance | query has many', {
  beforeEach: function() {
    Post = DS.Model.extend(HasManyQuery.ModelMixin, {
      comments: DS.hasMany('comment', {async: true})
    });

    Comment = DS.Model.extend(HasManyQuery.ModelMixin, {
      post: DS.belongsTo('post', { async: true })
    });

    adapter = DS.RESTAdapter.extend(HasManyQuery.RESTAdapterMixin, {});

    env = setupStore({
      post: Post,
      comment: Comment,
      adapter: adapter
    });

    store = env.store;
  },

  afterEach: function() {
    Ember.run(env.container, 'destroy');
  }
});

test('Querying has-many relationship generates correct URL parameters', function(assert) {
  var ajaxCalledCount = 0;
  var requiredUrl = '';

  env.adapter.findRecord = function() {
    return Ember.RSVP.resolve({ post: { id: 5, links: { comments: "/posts/5/comments" } } });
  };

  env.adapter.ajax = function(url, method, options) {
    var queryString = Ember.$.param(options.data);
    assert.equal(url + '?' + queryString, requiredUrl, 'URL used to query has-many relationship is correct');
    ajaxCalledCount++;
    return Ember.RSVP.resolve({ comments: [] });
  };

  stop();
  Ember.run(function() {
    env.store.findRecord('post', 5).then(async(function(post) {
      requiredUrl = '/posts/5/comments?page=1';
      return post.query('comments', {page: 1}).then(async(function() {
        requiredUrl = '/posts/5/comments?page=2';
        return post.query('comments', {page: 2});
      }));
    })).then(function() {
      assert.equal(ajaxCalledCount, 2, 'Adapter ajax function was called to query has-many relationship');
      start();
    });
  });
});

test('Querying has-many relationship multiple times doesn\'t clear belongs-to-sticky association', function(assert) {
  Comment.reopen({
    post: HasManyQuery.belongsToSticky('post', { async: true })
  });

  env.adapter.findRecord = function() {
    return Ember.RSVP.resolve({ post: { id: 5, links: { comments: "/posts/5/comments" } } });
  };

  env.adapter.ajax = function(url, method, options) {
    var queryString = Ember.$.param(options.data);
    var page = queryString.match(/^.*(\d+)$/)[1];
    return Ember.RSVP.resolve({ comments: [{id: page * 2}, {id: page * 2 + 1}] });
  };

  Ember.run(function() {
    env.store.findRecord('post', 5).then(async(function(post) {
      return post.query('comments', {page: 1}).then(async(function(comments1) {
        var comments1Copy = comments1.slice(0);
        return post.query('comments', {page: 2}).then(async(function(comments2) {
          comments1Copy.forEach(function(comment) {
            assert.equal(comment.get('post.id'), 5, 'belongs-to association sticky after multiple has-many queries');
          });
          comments2.forEach(function(comment) {
            assert.equal(comment.get('post.id'), 5, 'belongs-to association correct');
          });
        }));
      }));
    }));
  });
});
