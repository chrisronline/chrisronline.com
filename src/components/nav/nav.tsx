import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { brands } from '@fortawesome/fontawesome-svg-core/import.macro';

import './nav.scss';
import { SubNav } from './subnav';
import { NavPage } from '../../types';
import { PlaygroundProjectEnum } from '../../pages/playground/types';
import { getPlaygroundProjectLabel } from '../../lib/playground_project_label';

const PAGES: NavPage[] = [
  { page: 'home' },
  {
    page: 'playground',
    // subpagePath: 'projects',
    // subpages: Object.values(PlaygroundProjectEnum).map((page) => {
    //   return { page, label: getPlaygroundProjectLabel(page) };
    // }),
  },
  { page: 'projects' },
];

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
  let activePage: NavPage = null;
  const navLinks = PAGES.map((routePage) => {
    const { page, subpages, subpagePath } = routePage;
    const link = `/${page === 'home' ? '' : page}`;
    if (location.pathname.startsWith(link)) {
      activePage = routePage;
    }
    return (
      <li className="nav-item" key={page}>
        <NavLink className="nav-link" to={link}>
          {page[0].toUpperCase() + page.substring(1)}
        </NavLink>
        {subpages && location.pathname.startsWith(link) ? (
          <ul className="site-sublinks">
            <SubNav
              parent={subpagePath ? `${page}/${subpagePath}` : page}
              pages={subpages}
            />
          </ul>
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
      <ul className="mobile-sublinks">
        {activePage && activePage.subpages ? (
          <SubNav
            parent={
              activePage.subpagePath
                ? `${activePage.page}/${activePage.subpagePath}`
                : activePage.page
            }
            pages={activePage.subpages}
          />
        ) : null}
      </ul>
      <ul className="external-links">{externalNavLinks}</ul>
    </nav>
  );
};
