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

  $(document).ready(function() {
    var sections = $('section[id]');
    var root = $('html, body');
    var manualChange = false;

    function showHash(hash) {
      manualChange = true;
      var element = $(hash);
      if (element.length) {
        sections.each(function() {
          $(this).hide().removeClass('visible');
        })
        element.show().addClass('svisible');
        $('nav a').removeClass('active');
        $('nav a[href="' + hash + '"]').addClass('active');
        setTimeout(function() {
          element.removeClass('svisible').addClass('visible');
        });
        window.location.hash = hash.substring(1);
      }
    }

    $(window).on('scroll', function(e) {
      if (manualChange) {
        e.stopImmediatePropagation();
        e.preventDefault();
        $(window).scrollTop(0);
        manualChange = false;
      }
    });

    $('a[href*=#]').on('click', function(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      showHash($(this).attr('href'));
    });
    showHash(window.location.hash || '#about');
  });
})();

/** @jsx React.DOM */
(function() {
  'use strict';

  var About = React.createClass({displayName: 'About',
    render: function() {
      return (
        React.DOM.div({className: "section-content"}, 
          React.DOM.p(null, "Hi. I'm Chris. I write code. I'm writing code using AngularJS right now. I love open source and am actively working on contributing more."), 
          React.DOM.p(null, "I am currently building ", React.DOM.a({href: "https://www.bookongigwell.com/"}, "Gigwell"), ".")
        )
      );
    }
  });

  React.renderComponent(
    About(null),
    document.getElementById('about-content')
  );
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
      $.ajax('http://localhost:8081/api/github').done(
        function(response) {
          var repos = _.sortBy(response.repos, function(repo) {
            return repo.stargazers_count || repo.commits.length;
          }).reverse();
          _.each(repos, function(repo) {
            var category = _.find(categories, function(category) {
              return category.titleRegEx.test(repo.name);
            });
            category.projects.push(repo);
            category.loading = false;
          });
          self.setState({categories: categories});
        }
      );
    },
    render: function() {
      var categoryNodes = this.state.categories.map(function(category, index) {
        return (
          Category({category: category, key: category.name})
        );
      });
      return (
        React.DOM.div({className: "section-content"}, 
          categoryNodes
        )
      );
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
          React.DOM.li(null, 
            Project({project: project, key: index})
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

  var Project = React.createClass({displayName: 'Project',
    render: function() {
      var project = this.props.project;
      return (
        React.DOM.article({className: "project"}, 
          React.DOM.header(null, 
            React.DOM.h4(null, 
              React.DOM.a({href: project.html_url}, 
                React.DOM.i({className: "fa fa-github"}), 
                " ", 
                project.name
              )
            )
          ), 
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
