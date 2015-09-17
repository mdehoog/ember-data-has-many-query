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
  ajax: function(url, type, options) {
    var self = this;
    console.log('AJAX request to: ' + url);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var response = {};
      var match;
      if (match = url.match(/^\/api\/posts$/)) {
        response.posts = [];
        for (var i = 0; i < 5; i++) {
          response.posts.push(self.generatePost(i));
        }
      } else if (match = url.match(/^\/api\/posts\/(\d+)$/)) {
        var id = match[1];
        response.post = self.generatePost(id);
      } else if (match = url.match(/^\/api\/posts\/(\d+)\/comments\?page=(\d+)$/)) {
        var postId = match[1];
        var commentsPage = match[2];
        response.comments = [];
        for (var i = 0; i < 5; i++) {
          response.comments.push(self.generateComment(i + (commentsPage - 1) * 5));
        }
      }
      Ember.run(null, resolve, response);
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
    }
  }
});
