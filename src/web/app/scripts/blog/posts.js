(function() {
  'use strict';

  var BlogPosts = {
    discover: function() {
      var self = this;
      var navigation = $('#post-navigation');
      $('[data-blog-post]').each(function() {
        var post = $(this);
        var headers = {};
        post.find('h1,h2,h3,h4,h5').each(function() {
          var header = $(this);
          navigation.append($('<li></li>').text(header.text()));
        });
      });
      return this;
    },
    listen: function() {
      return this;
    }
  };

  // $(document).ready(function() {
  //   BlogPosts
  //     .discover()
  //     .listen();
  // });
})();
