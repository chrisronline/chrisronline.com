import React from 'react';
import classnames from 'classnames';
import { PAGES } from './config';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  solid,
  regular,
  brands,
} from '@fortawesome/fontawesome-svg-core/import.macro';

import './nav.scss';

const externalLinks = [
  {
    link: 'github.com/chrisronline',
    icon: <FontAwesomeIcon icon={brands('github')} size="2x" />
  },
  {
    link: 'twitter.com/chrisronline',
    icon: <FontAwesomeIcon icon={brands('twitter')} size="2x" />
  },
  {
    link: 'linkedin.com/in/chrisronline',
    icon: <FontAwesomeIcon icon={brands('linkedin')} size="2x" />
  },
];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NavProps {}
export const Nav: React.FunctionComponent<NavProps> = () => {
  const navLinks = PAGES.map((page) => (
    <li className="nav-item" key={page}>
      <NavLink className="nav-link" to={`/${page === 'home' ? '' : page}`}>
        {page[0].toUpperCase() + page.substring(1)}
      </NavLink>
    </li>
  ));
  const externalNavLinks = externalLinks.map((link) => {
    const url = `http://${link.link}`;

    return (
      <li className="external-item" key={link.link}>
        <a href={url} className="external-link">
          {link.icon}
          <span className="nav-text">{link.link}</span>
        </a>
      </li>
    );
  });

  return (
    <nav className="site-nav">
      <ul className="site-links">{navLinks}</ul>
      <ul className="external-links">{externalNavLinks}</ul>
    </nav>
  );
};
