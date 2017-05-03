import React, { Component } from 'react'
import PropTypes from 'prop-types'
import superagent from 'superagent'

/* eslint-disable global-require */
if (process.env.BROWSER) require('./projects.scss')
/* eslint-enable global-require */

const sortByStarGazers = (a, b) => {
  if (a.stargazers_count === b.stargazers_count) return 0
  return a.stargazers_count > b.stargazers_count ? -1 : 1
}

/* eslint-disable camelcase */
const Project = ({ html_url, name, fork, description }) => (
  <li>
    <article className="project">
      <header>
        <h4 className="project-heading">
          <a href={html_url}>
            <i className="fa fa-github" />
            &nbsp;
            {name}
            &nbsp;
            {fork
              ? <i className="fa fa-code-fork" />
              : null
            }
          </a>
        </h4>
      </header>
      <p className="project-description">{description}</p>
    </article>
  </li>
)

Project.propTypes = {
  html_url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  fork: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
}
/* eslint-enable camelcase */

class Projects extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      categories: [
        {
          id: 'angular',
          label: 'AngularJS',
          titleRegEx: /angular/,
          projects: [],
        },
        {
          id: 'fork',
          label: 'Forks',
          fork: true,
          projects: [],
        },
        {
          id: 'misc',
          label: 'Misc',
          titleRegEx: /\\*/,
          projects: [],
        },
      ],
    }
  }

  componentDidMount() {
    this.fetchGithubData()
  }

  fetchGithubData() {
    superagent
      .get('https://api.github.com/users/chrisronline/repos')
      .end((err, result) => {
        const projects = result.body
        projects.sort(sortByStarGazers)

        const usedProjects = {}

        const categories = this.state.categories.map((category) => {
          projects.forEach((project) => {
            const matchesTitle = category.titleRegEx && category.titleRegEx.test(project.name)
            const matchesFork = category.fork && project.fork

            if (!usedProjects[project.name] && (matchesTitle || matchesFork)) {
              category.projects.push(project)
              usedProjects[project.name] = true
            }
          })

          return category
        })

        this.setState({ loading: false, categories })
      })
  }

  render() {
    const { categories, loading } = this.state

    let content = null

    if (loading) {
      content = <i className="fa fa-spinner fa-spin" />
    } else {
      const categoryList = categories.map((category) => {
        const projectList = category.projects.map(project => <Project {...project} />)

        return (
          <article>
            <header>
              <h3>{category.label}</h3>
            </header>
            <ul>
              {projectList}
            </ul>
          </article>
        )
      })
      content = categoryList
    }

    return (
      <section className="projects-page">
        <header>
          <h2>Projects</h2>
        </header>
        { loading
          ? <p>Public repositories listed on GitHub</p>
          : null
        }
        {content}
      </section>
    )
  }
}

export default Projects
