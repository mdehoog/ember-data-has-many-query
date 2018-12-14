import { Promise } from 'rsvp';
import DS from 'ember-data';
import HasManyQuery from 'ember-data-has-many-query';

export default DS.RESTAdapter.extend(HasManyQuery.RESTAdapterMixin, {
  namespace: 'api',
  shouldReloadAll: function() {
    return false;
  },
  shouldBackgroundReloadRecord: function() {
    return true;
  },

  //mock ajax calls for testing
  ajax: function(url, method, options) {
    const self = this;
    let i;
    // console.log('AJAX request to: ' + url + ' with options ' + JSON.stringify(options));
    return new Promise(function(resolve) {
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
          response.comments.push(self.generateComment(i + (commentsPage - 1) * 5));
        }
      }
      resolve(response);
    });
  },
  generatePost: function(id) {
    return {
      id: id,
      text: 'Post ' + id,
      links: {
        comments: '/api/posts/' + id + '/comments'
      }
    };
  },
  generateComment: function(id) {
    return {
      id: id,
      text: 'Comment ' + id
    };
  }
});
