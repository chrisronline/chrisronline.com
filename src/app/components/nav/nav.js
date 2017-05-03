import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

/* eslint-disable global-require */
if (process.env.BROWSER) require('./nav.scss')
/* eslint-enable global-require */

function NavLink({ link, onClick, isActive }) {
  const classes = classnames('nav-link', { active: isActive })
  const label = link[0].toUpperCase() + link.substring(1)

  return (
    <li className="nav-item">
      <a className={classes} href={`/${link}`} onClick={onClick}>
        {label}
      </a>
    </li>
  )
}

NavLink.propTypes = {
  link: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
}

const links = ['about', 'projects']
const externalLinks = [
  {
    link: 'github.com/chrisronline',
    icon: 'fa-github',
  },
  {
    link: 'twitter.com/chrisronline',
    icon: 'fa-twitter',
  },
  {
    link: 'linkedin.com/in/chrisronline',
    icon: 'fa-linkedin',
  },
]

const Nav = ({ location, navigate, toggleMobileNav }) => {
  const activeRoute = location
  const navLinks = links.map(link =>
    <NavLink
      link={link}
      onClick={(e) => { e.preventDefault(); navigate(`/${link}`) }}
      isActive={`/${link}` === activeRoute}
    />,
  )
  const externalNavLinks = externalLinks.map((link) => {
    const url = `http://${link.link}`
    const iconClasses = classnames('fa', 'fa-2x', link.icon)

    return (
      <li className="external-item">
        <a href={url} className="external-link">
          <i className={iconClasses} />
          <span className="nav-text">{link.link}</span>
        </a>
      </li>
    )
  })

  return (
    <nav className="site-nav">
      <a className="nav-mobile" href="/" onClick={toggleMobileNav}>
        Mobile Nav
      </a>
      <ul className="site-links">
        {navLinks}
      </ul>
      <ul className="external-links">
        {externalNavLinks}
      </ul>
    </nav>
  )
}

Nav.propTypes = {
  navigate: PropTypes.func.isRequired,
  toggleMobileNav: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
}

export default Nav
