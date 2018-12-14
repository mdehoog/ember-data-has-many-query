import { run } from '@ember/runloop';
import $ from 'jquery';
import { resolve } from 'rsvp';
import DS from 'ember-data';
import { module, test } from 'qunit';
import { setupStore } from '../helpers/store';
import HasManyQuery from 'ember-data-has-many-query';

var env;

var Post = DS.Model.extend(HasManyQuery.ModelMixin, {
  comments: DS.hasMany('comment', {async: true})
});

var Comment = DS.Model.extend(HasManyQuery.ModelMixin, {
  post: DS.belongsTo('post', {async: true})
});

function initializeStore(adapter) {
  env = setupStore({
    adapter: adapter
  });

  env.registry.register('model:post', Post);
  env.registry.register('model:comment', Comment);
}

module("integration/query-has-many", function(hooks) {
  hooks.beforeEach(function() {
    var adapter = DS.RESTAdapter.extend(HasManyQuery.RESTAdapterMixin, {});
    initializeStore(adapter);
  });

  hooks.afterEach(function() {
    env = null;
  });

  test('Querying has-many relationship generates correct URL parameters', function (assert) {
    var ajaxCalledCount = 0;
    var requiredUrl = '';

    env.adapter.findRecord = function () {
      return resolve({post: {id: 5, links: {comments: "/posts/5/comments"}}});
    };

    env.adapter.ajax = function (url, method, options) {
      var queryString = $.param(options.data);
      assert.equal(url + '?' + queryString, requiredUrl, 'URL used to query has-many relationship is correct');
      ajaxCalledCount++;
      return resolve({comments: [{id: 1}]});
    };

    var done = assert.async();
    run(function () {
      env.store.findRecord('post', 5).then(assert.wait(function (post) {
        requiredUrl = '/posts/5/comments?page=1';
        return post.query('comments', {page: 1}).then(assert.wait(function () {
          requiredUrl = '/posts/5/comments?page=2';
          return post.query('comments', {page: 2});
        }));
      })).then(function () {
        assert.equal(ajaxCalledCount, 2, 'Adapter ajax function was called to query has-many relationship');
        done();
      });
    });
  });

  test('Querying has-many relationship multiple times doesn\'t clear belongs-to-sticky association', function (assert) {
    Comment.reopen({
      post: HasManyQuery.belongsToSticky('post', {async: true})
    });

    env.adapter.findRecord = function () {
      return resolve({post: {id: 5, links: {comments: "/posts/5/comments"}}});
    };

    env.adapter.ajax = function (url, method, options) {
      var queryString = $.param(options.data);
      var page = queryString.match(/^.*(\d+)$/)[1];
      return resolve({comments: [{id: page * 2}, {id: page * 2 + 1}]});
    };

    run(function () {
      env.store.findRecord('post', 5).then(assert.wait(function (post) {
        return post.query('comments', {page: 1}).then(assert.wait(function (comments1) {
          var comments1Copy = comments1.slice(0);
          return post.query('comments', {page: 2}).then(assert.wait(function (comments2) {
            comments1Copy.forEach(function (comment) {
              assert.equal(comment.get('post.id'), 5, 'belongs-to association sticky after multiple has-many queries');
            });
            comments2.forEach(function (comment) {
              assert.equal(comment.get('post.id'), 5, 'belongs-to association correct');
            });
          }));
        }));
      }));
    });
  });
});
