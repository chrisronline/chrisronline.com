import classNames from 'classnames';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/home';
import { Nav } from './nav';
import { PlayGround } from './pages/playground';
import { Projects } from './pages/projects';
import './app.scss';


export function App() {
  const classes = classNames('container'); //, { 'mobile-nav-active': this.state.showMobileNav })
  return (
    <BrowserRouter>
      <div className={classes}>
        <header className="app-header">
          <h1 className="app-heading">chrisronline.com</h1>
          <Nav />
        </header>
        <div id="content">
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/playground" element={<PlayGround />}/>
            <Route path="/projects" element={<Projects />}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
