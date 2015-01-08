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

  var Projects = React.createClass({
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
          <Category category={category} key={category.id}/>
        );
      });

      if (categoryNodes.length) {
        return (
          <div className="section-content">
            {categoryNodes}
          </div>
        );
      }
      else {
        return (
          <div className="section-content">
            <i className="fa fa-spinner fa-spin"></i>
          </div>
        );
      }
    }
  });

  var Category = React.createClass({
    render: function() {
      var category = this.props.category;
      return (
        <article>
          <CategoryHeader label={category.label}/>
          <ProjectList projects={category.projects}/>
        </article>
      );
    }
  });

  var CategoryHeader = React.createClass({
    render: function() {
      return (
        <header>
          <h3>{this.props.label}</h3>
        </header>
      );
    }
  });

  var ProjectList = React.createClass({
    render: function() {
      var projectNodes = this.props.projects.map(function(project, index) {
        return (
          <li key={project.id}>
            <Project project={project}/>
          </li>
        );
      });
      return (
        <ul>
          {projectNodes}
        </ul>
      );
    }
  });

  var ProjectHeader = React.createClass({
    render: function() {
      var project = this.props.project;
      var forkIcon = '';
      if (project.fork) {
        forkIcon = <i className="fa fa-code-fork"></i>;
      }
      return (
        <header>
          <h4>
            <a href={project.html_url}>
              <i className="fa fa-github"></i>
              &nbsp;
              {project.name}
              &nbsp;
              {forkIcon}
            </a>
          </h4>
        </header>
      );
    }
  });

  var Project = React.createClass({
    render: function() {
      var project = this.props.project;
      return (
        <article className="project">
          <ProjectHeader project={project}/>
          <p>{project.description}</p>
        </article>
      );
    }
  });

  React.renderComponent(
    <Projects categories={categories}/>,
    document.getElementById('projects-content')
  );
})();
