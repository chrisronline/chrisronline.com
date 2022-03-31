import React from 'react';
import { NavLink } from 'react-router-dom';
import { PLAYGROUND_PROJECTS } from './config';
import './playground.scss';

export const Playground = () => {
  return (
    <section className="playground-page">
      <header>
        <h2>Playground</h2>
      </header>
      <ul>
        {PLAYGROUND_PROJECTS.map((project) => (
          <li key={project.url}>
            <article className="playground-project">
              <header>
                <h4 className="playground-project-heading">
                  <NavLink className="nav-link" to={`/playground/projects/${project.url}`}>
                    {project.label}
                  </NavLink>
                </h4>
              </header>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};
