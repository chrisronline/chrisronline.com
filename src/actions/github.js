var GitHubApi = require('github');
var Step = require('step');

exports.action = {
  name:                   'github',
  description:            'github',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,

  inputs: {
    required: [],
    optional: [],
  },

  run: function(api, connection, next){
    // your logic here
    var github = new GitHubApi({version: '3.0.0'});
    var auth = api.config.tokens.github;
    auth.type = 'basic';
    github.authenticate(auth);

    Step(
      function getRepos() {
        github.repos.getAll({}, this);
      },
      function getCommits(err, repos) {
        if (err) throw err;
        var group = this.group();
        repos.forEach(function(repo) {
          var igroup = group();
          github.repos.getCommits({ user: repo.owner.login, repo: repo.name }, function(err, commits) {
            repo.commits = commits;
            return igroup(err, repo);
          });
        })
      },
      function finish(err, repos) {
        connection.response.repos = repos;
        connection.response.err = err;
        next(connection, true);
      }
    );
  }
};
