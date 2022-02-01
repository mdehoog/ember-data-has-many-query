import { run } from '@ember/runloop';
import { resolve } from 'rsvp';
import Model, { belongsTo, hasMany } from '@ember-data/model';
import RESTAdapter from '@ember-data/adapter/rest';
import { module, test } from 'qunit';
import { setupStore } from '../helpers/store';
import QueryableAdapterMixin from 'ember-data-has-many-query/mixins/queryable-adapter';
import QueryableModelMixin from 'ember-data-has-many-query/mixins/queryable-model';
import belongsToSticky from 'ember-data-has-many-query/belongs-to-sticky';

let env;

let Post = class extends Model.extend(QueryableModelMixin) {
  @hasMany('comment', { async: true }) comments;
};

let Comment = class extends Model.extend(QueryableModelMixin) {
  @belongsTo('post', { async: true }) post;
};

function queryParams(source) {
  const array = [];

  for (const key in source) {
    array.push(encodeURIComponent(key) + '=' + encodeURIComponent(source[key]));
  }

  return array.join('&');
}

function initializeStore(adapter) {
  env = setupStore({
    adapter: adapter,
  });

  env.registry.register('model:post', Post);
  env.registry.register('model:comment', Comment);
}

module('integration/query-has-many', function (hooks) {
  hooks.beforeEach(function () {
    let Adapter = class extends RESTAdapter.extend(QueryableAdapterMixin) {};
    initializeStore(Adapter);
  });

  hooks.afterEach(function () {
    env = null;
  });

  test('Querying has-many relationship generates correct URL parameters', function (assert) {
    assert.expect(3);

    let ajaxCalledCount = 0;
    let requiredUrl = '';

    env.adapter.findRecord = function () {
      return resolve({
        post: { id: 5, links: { comments: '/posts/5/comments' } },
      });
    };

    env.adapter.ajax = function (url, method, options) {
      let queryString = queryParams(options.data);
      assert.strictEqual(
        url + '?' + queryString,
        requiredUrl,
        'URL used to query has-many relationship is correct'
      );
      ajaxCalledCount++;
      return resolve({ comments: [{ id: 1 }] });
    };

    let done = assert.async();
    run(function () {
      env.store
        .findRecord('post', 5)
        .then(function (post) {
          requiredUrl = '/posts/5/comments?page=1';
          return post.query('comments', { page: 1 }).then(function () {
            requiredUrl = '/posts/5/comments?page=2';
            return post.query('comments', { page: 2 });
          });
        })
        .then(function () {
          assert.strictEqual(
            ajaxCalledCount,
            2,
            'Adapter ajax function was called to query has-many relationship'
          );
          done();
        });
    });
  });

  test("Querying has-many relationship multiple times doesn't clear belongs-to-sticky association", function (assert) {
    assert.expect(4);

    Comment.reopen({
      post: belongsToSticky('post', { async: true }),
    });

    env.adapter.findRecord = function () {
      return resolve({
        post: { id: 5, links: { comments: '/posts/5/comments' } },
      });
    };

    env.adapter.ajax = function (url, method, options) {
      let queryString = queryParams(options.data);
      let page = queryString.match(/^.*(\d+)$/)[1];
      return resolve({ comments: [{ id: page * 2 }, { id: page * 2 + 1 }] });
    };

    let done = assert.async();
    run(function () {
      env.store.findRecord('post', 5).then(function (post) {
        return post.query('comments', { page: 1 }).then(function (comments1) {
          let comments1Copy = comments1.slice(0);
          return post.query('comments', { page: 2 }).then(function (comments2) {
            comments1Copy.forEach(function (comment) {
              assert.strictEqual(
                comment.get('post.id'),
                '5',
                'belongs-to association sticky after multiple has-many queries'
              );
            });
            comments2.forEach(function (comment) {
              assert.strictEqual(
                comment.get('post.id'),
                '5',
                'belongs-to association correct'
              );
            });
            done();
          });
        });
      });
    });
  });
});
