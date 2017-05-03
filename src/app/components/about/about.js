import React from 'react'

/* eslint-disable global-require */
if (process.env.BROWSER) require('./about.scss')
/* eslint-enable global-require */

const About = () => (
  <section className="about-page">
    <header>
      <h2>Me</h2>
    </header>
    <img
      className="chris-selfie"
      src="/app/assets/images/chris.jpg"
      alt="Chris Roberson"
    />
    <p className="about-copy">
      Hi.
      I&apos;m Chris.
      I write code.
    </p>
    <p className="about-copy">
      I am currently working on <a href="https://www.elastic.co/products/kibana">Kibana</a> at <a href="https://www.elastic.co">Elastic</a>.
    </p>
  </section>
)

export default About
