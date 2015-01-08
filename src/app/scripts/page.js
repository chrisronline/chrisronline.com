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
