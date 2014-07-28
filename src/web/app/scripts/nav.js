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
        setTimeout(function() {
          element.removeClass('svisible').addClass('visible');
        });
        $('nav a').removeClass('active');
        $('nav a[href="' + hash + '"]').addClass('active');

        // On mobile, doing this in sync causes a the page
        // to jump so do it after a second
        setTimeout(function() {
          window.location.hash = hash.substring(1);
        }, 1000);
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
