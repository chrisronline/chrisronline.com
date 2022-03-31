import React from 'react';
import { useLocation } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { SubNavPage } from '../../types';

export interface SubNavProps {
  pages: SubNavPage[];
}
export const SubNav: React.FunctionComponent<SubNavProps> = ({ pages }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search.slice(1));
  
  return (
    <ul className="site-sublinks">
      {pages.map(({ page, usesQueryString, queryStringKey }) => {
        let classes = 'nav-link';
        if (params.get(queryStringKey) === page) {
          classes += ' active';
        }

        let to = page;
        if (usesQueryString) {
          to = `?${queryStringKey}=${page}`
        }
        return (
          <li className="nav-item" key={page}>
            <Link className={classes} to={to}>
              {page[0].toUpperCase() + page.substring(1)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};