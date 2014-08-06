(function() {
  'use strict';

  var SinglePageNavigator = {
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
        self.__routes.push(route);
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
        e.preventDefault();

        var target = $(e.currentTarget);
        var href = target.attr('href');
        var id = href.substring(1);
        var route = self.findRoute(id);
        self.go(route);
      });

      var defaultRoute = this.findRoute(window.location.hash.substring(1)) || this.findRoute(self.__config.default);
      if (defaultRoute) {
        self.go(defaultRoute);
      }

      return this;
    },
    findRoute: function(value) {
      return _.find(this.__routes, function(route) {
        return route.id === value || route.hash === value;
      });
    },
    reset: function(routes) {
      _.each(routes || this.__routes, function(route) {
        // console.log('hiding', route, $('#' + route.id).length);
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
          this._show(route.root);
        }
      }

      this._show(route);

      // console.log('showing', route, this.__current);
      history.pushState(null, null, '#' + route.hash);
      this.__current = route;
    },
    _show: function(route) {
      var element = $('#' + route.id);
      element.show().addClass('svisible');
      setTimeout(function() { element.removeClass('svisible').addClass('visible'); });
      _.each(route.links, function(link) { link.addClass('active'); });
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
