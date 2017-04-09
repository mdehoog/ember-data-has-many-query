import Ember from 'ember';
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
    var self = this;
    var i;
    console.log('AJAX request to: ' + url + ' with options ' + JSON.stringify(options));
    return new Ember.RSVP.Promise(function(resolve) {
      var response = {};
      var match;
      if (match = url.match(/^\/api\/posts$/)) {
        response.posts = [];
        for (i = 0; i < 5; i++) {
          response.posts.push(self.generatePost(i));
        }
      } else if (match = url.match(/^\/api\/posts\/(\d+)$/)) {
        var id = match[1];
        response.post = self.generatePost(id);
      } else if (match = url.match(/^\/api\/posts\/(\d+)\/comments$/)) {
        var commentsPage = options.data.page;
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
