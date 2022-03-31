import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, brands } from '@fortawesome/fontawesome-svg-core/import.macro';
import './projects.scss';

export const Projects = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  async function loadGithubProjects() {
    setIsLoading(true);
    const response = await fetch(
      'https://api.github.com/users/chrisronline/repos'
    );
    const result = await response.json();
    setProjects(result);
    setIsLoading(false);
  }

  useEffect(() => {
    loadGithubProjects();
  }, []);

  return (
    <section className="projects-page">
      <header>
        <h2>Projects</h2>
      </header>
      {isLoading ? (
        <div>
          <FontAwesomeIcon icon={solid('spinner')} spin={true} />
        </div>
      ) : null}
      <ul>
        {projects.map((project) => (
          <li key={project.name}>
            <article className="project">
              <header>
                <h4 className="project-heading">
                  <a href={project.html_url}>
                    <FontAwesomeIcon icon={brands('github')} />
                    &nbsp;
                    {project.name}
                    &nbsp;
                    {project.fork ? (
                      <FontAwesomeIcon icon={solid('code-fork')} />
                    ) : null}
                  </a>
                </h4>
              </header>
              <p className="project-description">{project.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};
