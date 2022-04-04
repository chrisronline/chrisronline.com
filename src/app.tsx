import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Nav } from './components';
import './app.scss';
import { ConfigContext } from './context';
import { ConfigContextType, PrivateConfig } from './types';
import { getConfig } from './config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

const Playground = lazy(() => import('./pages/playground'));
const PlaygroundProjects = lazy(() => import('./pages/playground/projects'));
const Home = lazy(() => import('./pages/home'));
const Projects = lazy(() => import('./pages/projects'));

function LazyRoute(component: React.ReactElement) {
  return (
    <Suspense
      fallback={<FontAwesomeIcon icon={solid('spinner')} spin={true} />}
    >
      {component}
    </Suspense>
  );
}

export function App() {
  const configContext: ConfigContextType = {
    catsApiKey: getConfig(PrivateConfig.CatsApiKey),
    googleApiKey: getConfig(PrivateConfig.GoogleApiKey),
  };
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
              <Route path="/" element={LazyRoute(<Home />)} />
              <Route path="/playground" element={LazyRoute(<Playground />)} />
              <Route
                path="/playground/projects/:projectId"
                element={LazyRoute(<PlaygroundProjects />)}
              />
              <Route path="/projects" element={LazyRoute(<Projects />)} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ConfigContext.Provider>
  );
}
