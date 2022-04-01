import React from 'react';
import { NavLink } from 'react-router-dom';
import { getPlaygroundProjectLabel } from '../../lib/playground_project_label';
import './playground.scss';
import { PlaygroundProjectEnum } from './types';

export const Playground = () => {
  return (
    <section className="playground-page">
      <header>
        <h2>Playground</h2>
      </header>
      <ul>
        {Object.keys(PlaygroundProjectEnum).map((project) => (
          <li key={project}>
            <article className="playground-project">
              <header>
                <h4 className="playground-project-heading">
                  <NavLink
                    className="nav-link"
                    to={`/playground/projects/${project.toLowerCase()}`}
                  >
                    {getPlaygroundProjectLabel(
                      PlaygroundProjectEnum[
                        project as keyof typeof PlaygroundProjectEnum
                      ]
                    )}
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
