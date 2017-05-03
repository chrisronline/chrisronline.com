import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Nav from '../nav/nav'

/* eslint-disable global-require */
if (process.env.BROWSER) require('./app.scss')
/* eslint-enable global-require */

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMobileNav: false,
    }

    this.onNavigate = this.navigate.bind(this)
    this.onToggleMobileNav = this.toggleMobileNav.bind(this)
  }

  navigate(...args) {
    this.setState({ showMobileNav: false })
    this.props.navigate(...args)
  }

  toggleMobileNav() {
    this.setState({ showMobileNav: !this.state.showMobileNav })
  }

  render() {
    const { location } = this.props
    const classes = classnames('container', { 'mobile-nav-active': this.state.showMobileNav })

    return (
      <div className={classes}>
        <header className="app-header">
          <h1 className="app-heading">chrisronline.com</h1>
          <Nav
            location={location}
            navigate={this.onNavigate}
            toggleMobileNav={this.onToggleMobileNav}
          />
        </header>
        <div id="content">
          {this.props.children}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  navigate: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default App
