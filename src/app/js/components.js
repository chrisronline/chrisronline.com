(function() {
  'use strict';

  WebFont.load({
    google: {
      families: ['Montserrat:400,700']
    }
  });
})();

(function() {
  'use strict';
})();

(function() {
  'use strict';

  function show(route) {
    var element = $('#' + route.id);
    element.show().addClass('svisible');
    setTimeout(function() {
      element.removeClass('svisible').addClass('visible');
    });
    _.each(route.links, function(link) {
      link.addClass('active');
    });
  }

  function computeHash(route) {
    route.__computedHash = '#' + route.hash;
    if (route.regExp) {
      var match = route.regExp.exec(window.location.hash);
      if (match && match.length) {
        route.__computedHash = '#' + route.hash + '/' + match[1];
        route.__matchedHash = match[1];
      }
    }
  }

  var SinglePageNavigator = window.SinglePageNavigator = {
    __current: null,
    __routes: [],
    __config: {},
    config: function(config) {
      this.__config = config;
      return this;
    },
    discover: function() {
      var self = this;
      $('[data-navigate]').each(function() {
        var point = $(this);
        var id = point.attr('id');
        var route = {
          id: id,
          hash: point.data('navigate') || id,
          links: []
        };
        var parentPoints = point.parents('[data-navigate]');
        if (parentPoints.length) {
          route.root = self.findRoute(parentPoints.first().attr('id'));
        }
        self.add(route);
      });
      $('[data-navigate-link]').each(function() {
        var link = $(this);
        var id = link.data('navigate-link');
        var route = self.findRoute(id);
        if (!route) {
          console.warn('No route found for navigate link', id);
        }
        else {
          route.links.push(link);
        }
      });
      return this;
    },
    listen: function() {
      var self = this;
      $('*[href]').on('click', function(e) {
        var target = $(e.currentTarget);
        var href = target.attr('href');
        var id = href.substring(1);
        var route = self.findRoute(id);
        if (route) {
          e.preventDefault();
          self.go(route);
        }
      });

      var defaultRoute = this.findRoute(window.location.hash.substring(1)) || this.findRoute(self.__config.default);
      if (defaultRoute) {
        self.go(defaultRoute);
      }

      return this;
    },
    findRoute: function(value) {
      return _.find(this.__routes, function(route) {
        if (route.id === value || route.hash === value) {
          return true;
        }
        if (route.regExp && route.regExp.test(value)) {
          return true;
        }
        return false;
      });
    },
    reset: function(routes) {
      _.each(routes || this.__routes, function(route) {
        $('#' + route.id).hide().removeClass('visible');
        _.each(route.links, function(link) {
          link.removeClass('active');
        });
      });
    },
    go: function(route) {
      if (this.__current && (route.root === this.__current.root || route.root === this.__current)) {
        // Same root
        this.reset(_.filter(this.__routes, { root: route.root }));
      }
      else {
        this.reset();
        if (route.root) {
          show(route.root);
        }
      }

      show(route);

      computeHash(route);

      route.handler && route.handler(route);

      history.pushState(null, null, route.__computedHash);
      this.__current = route;
    },
    add: function(route) {
      var existing = _.find(this.__routes, { id: route.id });
      if (!existing) {
        this.__routes.push(route);
      }
      else {
        existing = _.extend(existing, route);
      }
    },
    get: function() {
      return this.__current;
    }
  };

  $(document).ready(function() {
    SinglePageNavigator
      .config({
        default: 'about'
      })
      .discover()
      .listen();
  });
})();

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

      var active = SinglePageNavigator.get();
      if (active.id === 'blog') {
        history.pushState(null, null,
          this.__activeTags.length ? '#blog/' + this.__activeTags.join(',') : '#blog');
      }

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
    regExp: /blog\/tags\/(.+)/,
    id: 'blog',
    handler: function(route) {
      if (!_.isEmpty(route.__matchedHash)) {
        BlogTags.load(route.__matchedHash.split(','));
      }
    }
  });

  $(document).ready(function() {
    BlogTags
      .config({})
      .discover()
      .listen();
  });
})();

/** @jsx React.DOM */
(function() {
  'use strict';

  var categories = [
    {
      id: 'angular',
      label: 'AngularJS',
      titleRegEx: /angular/,
      projects: [],
      loading: true
    },
    {
      id: 'fork',
      label: 'Forks',
      fork: true,
      projects: [],
      loading: true
    },
    {
      id: 'misc',
      label: 'Misc',
      titleRegEx: /\\*/,
      projects: [],
      loading: true
    }
  ];

  var Projects = React.createClass({displayName: 'Projects',
    componentDidMount: function() {
      this.loadGitHubProjects();
    },
    getInitialState: function() {
      return { categories: [] };
    },
    loadGitHubProjects: function() {
      var categories = this.props.categories;
      var self = this;
      var projects = [];
      $.ajax('https://api.github.com/users/chrisronline/repos').done(
        function(repos) {
          var count = repos.length;
          _.each(repos, function(repo) {
            $.ajax('https://api.github.com/repos/chrisronline/' + repo.name + '/commits').done(
              function(commits) {
                projects.push(_.extend(repo, { commits: commits }));
                if (--count === 0) {
                  init();
                }
              }
            );
          });
        }
      );

      function init() {
        var repos = _.sortBy(projects, function(repo) {
          return repo.stargazers_count || repo.commits.length;
        }).reverse();
        _.each(repos, function(repo) {
          var category = _.find(categories, function(category) {
            if (category.titleRegEx) {
              return category.titleRegEx.test(repo.name);
            }
            if (category.fork) {
              return repo.fork;
            }
          });
          category.projects.push(repo);
          category.loading = false;
        });
        self.setState({categories: categories});
      }
    },
    render: function() {
      var categoryNodes = this.state.categories.map(function(category, index) {
        return (
          Category({category: category, key: category.id})
        );
      });

      if (categoryNodes.length) {
        return (
          React.DOM.div({className: "section-content"}, 
            categoryNodes
          )
        );
      }
      else {
        return (
          React.DOM.div({className: "section-content"}, 
            React.DOM.i({className: "fa fa-spinner fa-spin"})
          )
        );
      }
    }
  });

  var Category = React.createClass({displayName: 'Category',
    render: function() {
      var category = this.props.category;
      return (
        React.DOM.article(null, 
          CategoryHeader({label: category.label}), 
          ProjectList({projects: category.projects})
        )
      );
    }
  });

  var CategoryHeader = React.createClass({displayName: 'CategoryHeader',
    render: function() {
      return (
        React.DOM.header(null, 
          React.DOM.h3(null, this.props.label)
        )
      );
    }
  });

  var ProjectList = React.createClass({displayName: 'ProjectList',
    render: function() {
      var projectNodes = this.props.projects.map(function(project, index) {
        return (
          React.DOM.li({key: project.id}, 
            Project({project: project})
          )
        );
      });
      return (
        React.DOM.ul(null, 
          projectNodes
        )
      );
    }
  });

  var ProjectHeader = React.createClass({displayName: 'ProjectHeader',
    render: function() {
      var project = this.props.project;
      var forkIcon = '';
      if (project.fork) {
        forkIcon = React.DOM.i({className: "fa fa-code-fork"});
      }
      return (
        React.DOM.header(null, 
          React.DOM.h4(null, 
            React.DOM.a({href: project.html_url}, 
              React.DOM.i({className: "fa fa-github"}), 
              " ", 
              project.name, 
              " ", 
              forkIcon
            )
          )
        )
      );
    }
  });

  var Project = React.createClass({displayName: 'Project',
    render: function() {
      var project = this.props.project;
      return (
        React.DOM.article({className: "project"}, 
          ProjectHeader({project: project}), 
          React.DOM.p(null, project.description)
        )
      );
    }
  });

  React.renderComponent(
    Projects({categories: categories}),
    document.getElementById('projects-content')
  );
})();
