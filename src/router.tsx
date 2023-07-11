import React from 'react';
import { Map } from './routes/Map';
import {
  Route,
  Routes,
  BrowserRouter as Router,
} from 'react-router-dom';
import Home from './routes/Home';
import { Recogination } from './routes/Recogination';
import Voice from './routes/Voice';
import { MyKeyboard } from './routes/Keyboard';
import { Carnival } from './routes/Carnival';

const routes = [
  {
    path: '/',
    element: <Recogination />,
  },
  // {
  //   path: '/voice',
  //   element: <Voice />
  // },
  // {
  //   path: '/map',
  //   element: <Map />,
  // },
  // {
  //   path: '/reco',
  //   element: <Recogination />
  // },
  {
    path: '/keyboard',
    element: <MyKeyboard />
  },
  {
    path: '/wandering',
    element: <Carnival />
  }
];

export const PageRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {
          routes.map((route, index) => {
            return (
              <Route key={index} path={route.path} element={route.element} />
            )
          })
        }
      </Routes>
    </Router>
  )
}
