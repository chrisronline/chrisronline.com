/** @jsx React.DOM */
(function() {
  'use strict';

  var About = React.createClass({
    render: function() {
      return (
        <div className="section-content">
          <p>Hi. I'm Chris. I write code. I'm writing code using AngularJS right now. I love open source and am actively working on contributing more.</p>
          <p>I am currently building <a href="https://www.bookongigwell.com/">Gigwell</a>.</p>
        </div>
      );
    }
  });

  React.renderComponent(
    <About/>,
    document.getElementById('about-content')
  );
})();
