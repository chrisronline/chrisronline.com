import React from 'react';
import { PAGES } from '../../config';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { brands } from '@fortawesome/fontawesome-svg-core/import.macro';

import './nav.scss';
import { SubNav } from './subnav';

const externalLinks = [
  {
    link: 'github.com/chrisronline',
    icon: <FontAwesomeIcon icon={brands('github')} size="2x" />,
  },
  {
    link: 'twitter.com/chrisronline',
    icon: <FontAwesomeIcon icon={brands('twitter')} size="2x" />,
  },
  {
    link: 'linkedin.com/in/chrisronline',
    icon: <FontAwesomeIcon icon={brands('linkedin')} size="2x" />,
  },
];

export const Nav: React.FunctionComponent = () => {
  const location = useLocation();
  const navLinks = PAGES.map(({ page, subpages }) => {
    const link = `/${page === 'home' ? '' : page}`;
    return (
      <li className="nav-item" key={page}>
        <NavLink className="nav-link" to={link}>
          {page[0].toUpperCase() + page.substring(1)}
        </NavLink>
        {subpages && location.pathname.startsWith(link) ? (
          <SubNav pages={subpages} />
        ) : null}
      </li>
    );
  });
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
