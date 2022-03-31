import React from 'react';
import { NavLink } from 'react-router-dom';
import { SubNavPage } from '../../types';

export interface SubNavProps {
  pages: SubNavPage[];
  parent: string;
}
export const SubNav: React.FunctionComponent<SubNavProps> = ({
  parent,
  pages,
}) => {
  return (
    <ul className="site-sublinks">
      {pages.map(({ page, label }) => {
        const pageName = label ?? page;
        const fullPage = `${parent}/${page}`;
        return (
          <li className="nav-item" key={page}>
            <NavLink className="nav-link" to={fullPage}>
              {pageName[0].toUpperCase() + pageName.substring(1)}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};
