import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/home';
import { Nav } from './nav';
import { Playground, PlaygroundProjects } from './pages/playground';
import { Projects } from './pages/projects';
import './app.scss';
import { ConfigContext } from './context';
import { ConfigContextType, PrivateConfig } from './types';
import { getConfig } from './config';


export function App() {
  const configContext: ConfigContextType = {
    catsApiKey: getConfig(PrivateConfig.CatsApiKey)
  }
  return (
    <ConfigContext.Provider value={configContext}>
      <BrowserRouter>
        <div className="container">
          <header className="app-header">
            <h1 className="app-heading">chrisronline.com</h1>
            <Nav />
          </header>
          <div id="content">
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/playground" element={<Playground />}/>
              <Route path="/playground/projects/:projectId" element={<PlaygroundProjects />}/>
              <Route path="/projects" element={<Projects />}/>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ConfigContext.Provider>
  );
}
