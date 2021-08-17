import React from 'react';
import ReactDOM from 'react-dom';
import {transitions, positions, Provider as AlertProvider} from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

import App from './App';
import {AppContextProvider} from "./context/AppContextProvider";

import './index.css';

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...options}>
      <AppContextProvider>
        <App/>
      </AppContextProvider>
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
