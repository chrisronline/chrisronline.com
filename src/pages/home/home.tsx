import React from 'react'
import ChrisProfilePicture from '../../media/images/chris.jpg';
import './home.scss';

export const Home = () => {
  console.log({ ChrisProfilePicture })
  return (
    <section className="about-page">
      <header>
        <h2>Me</h2>
      </header>
      <img
        className="chris-selfie"
        src={ChrisProfilePicture}
        alt="Chris Roberson"
      />
      <p className="about-copy">Hi. I&apos;m Chris. I write code.</p>
      <p className="about-copy">
        I am currently working on{' '}
        <a href="https://www.elastic.co/products/kibana">Kibana</a> at{' '}
        <a href="https://www.elastic.co">Elastic</a>.
      </p>
    </section>
  )
}
