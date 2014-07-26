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
