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

  var Project = React.createClass({
    render: function() {
      var project = this.props.project;
      return (
        <article className="project">
          <header>
            <h4>
              <a href={project.html_url}>
                <i className="fa fa-github"></i>
                &nbsp;
                {project.name}
              </a>
            </h4>
          </header>
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
