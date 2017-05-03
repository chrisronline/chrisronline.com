/* eslint-env browser */
import React, { Component } from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { Router, Route } from 'react-enroute'
import App from './components/app/app'
import About from './components/about/about'
import Projects from './components/projects/projects'
import loadFonts from './fonts'

const navigate = (url, isDefault = false) => {
  if (!isDefault) window.history.pushState(null, '', url)
  render(<Site url={url} />, document.getElementById('app'))
}

const AttachContainer = route => (
  <App location={route.location} navigate={navigate}>
    {route.children}
  </App>
)

const setTitle = (path) => {
  let title = path.substr(1)
  title = title[0].toUpperCase() + title.substr(1)
  document.title = `chrisronline.com - ${title}`
}

class Site extends Component {
  componentDidMount() {
    if (process.env.BROWSER) loadFonts()

    const { url } = this.props

    if (url === '/') {
      navigate('/about')
    } else {
      setTitle(url)
    }
  }

  componentDidUpdate() {
    document.body.scrollTop = 0
  }

  render() {
    return (
      <Router location={this.props.url}>
        <Route path="/" component={AttachContainer}>
          <Route path="about" component={About} />
          <Route path="projects" component={Projects} />
        </Route>
      </Router>
    )
  }
}

Site.propTypes = {
  url: PropTypes.string.isRequired,
}

Site.defaultProps = {
  url: '/about'
}

if (process.env.BROWSER) {
  window.addEventListener('popstate', () => navigate(window.location.pathname))
  navigate(window.location.pathname, true)
}

export default Site

