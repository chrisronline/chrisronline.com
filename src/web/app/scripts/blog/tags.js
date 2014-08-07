(function() {
  'use strict';

  var BlogTags = {
    __config: null,
    __tags: [],
    __posts: [],
    __activeTags: [],
    config: function(config) {
      this.__config = config;
      return this;
    },
    discover: function() {
      var self = this;
      $('[data-tag]').each(function() {
        var tag = $(this);
        tag.on('click', _.bind(self._clicked, self));
        self.__tags.push({
          tagName: tag.data('tag'),
          tag: tag
        });
      });
      $('[data-tags]').each(function() {
        var post = $(this);
        var tags = _.map(
          post.data('tags').split(','),
          function(tag) {
            return tag.trim();
          }
        );
        self.__posts.push({
          post: post,
          tags: tags
        });
      });
      return this;
    },
    listen: function() {
      this.update();
      return this;
    },
    reset: function() {
      _.each(this.__posts, function(post) {
        post.post.hide();
      })
    },
    load: function(tags) {
      this.__activeTags = tags;
    },
    update: function() {
      _.each(this.__tags, function(tag) {
        tag.tag.removeClass('active');
        if (_.contains(this.__activeTags, tag.tagName)) {
          tag.tag.addClass('active');
        }
      }, this);

      history.pushState(null, null, '#blog/' + this.__activeTags.join(','));

      var self = this;
      self.reset();
      _.each(self.__posts, function(post) {
        if (self.__activeTags.length === 0 || _.intersection(post.tags, self.__activeTags).length) {
          post.post.show();
        }
      });
    },
    _clicked: function(e) {
      var tagNode = $(e.currentTarget);
      var tagName = tagNode.data('tag');
      if (_.contains(this.__activeTags, tagName)) {
        this.__activeTags = _.without(this.__activeTags, tagName);
      }
      else {
        this.__activeTags.push(tagName);
      }
      this.update();
    }
  };

  SinglePageNavigator.add({
    regExp: /blog\/(.+)/,
    id: 'blog',
    handler: function(route) {
      BlogTags.load(route.__matchedHash.split(','));
    }
  });

  $(document).ready(function() {
    BlogTags
      .config({})
      .discover()
      .listen();
  });
})();
