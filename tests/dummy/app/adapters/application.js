import RESTAdapter from '@ember-data/adapter/rest';
import QueryableAdapterMixin from 'ember-data-has-many-query/mixins/queryable-adapter';
import { Promise } from 'rsvp';

export default class ApplicationAdapter extends RESTAdapter.extend(
  QueryableAdapterMixin
) {
  namespace = 'api';
  shouldReloadAll() {
    return false;
  }
  shouldBackgroundReloadRecord() {
    return true;
  }

  //mock ajax calls for testing
  ajax(url, method, options) {
    const self = this;
    let i;
    // console.log('AJAX request to: ' + url + ' with options ' + JSON.stringify(options));
    return new Promise(function (resolve) {
      const response = {};
      if (url.match(/^\/api\/posts$/)) {
        response.posts = [];
        for (i = 0; i < 5; i++) {
          response.posts.push(self.generatePost(i));
        }
      } else if (url.match(/^\/api\/posts\/(\d+)$/)) {
        const id = url.match(/^\/api\/posts\/(\d+)$/)[1];
        response.post = self.generatePost(id);
      } else if (url.match(/^\/api\/posts\/(\d+)\/comments$/)) {
        const commentsPage = options.data.page;
        response.comments = [];
        for (i = 0; i < 5; i++) {
          response.comments.push(
            self.generateComment(i + (commentsPage - 1) * 5)
          );
        }
      }
      resolve(response);
    });
  }
  generatePost(id) {
    return {
      id: id,
      text: 'Post ' + id,
      links: {
        comments: '/api/posts/' + id + '/comments',
      },
    };
  }
  generateComment(id) {
    return {
      id: id,
      text: 'Comment ' + id,
    };
  }
}
