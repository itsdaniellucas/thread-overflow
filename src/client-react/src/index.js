import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import storageService from './services/storageService'
import axios from 'axios'
import qs from 'qs'

axios.interceptors.request.use((cfg) => {
  let token = storageService.getToken();

  if(token) {
    cfg.headers['x-access-token'] = token;
  }

  cfg.paramsSerializer = params => {
    return qs.stringify(params, {
      encode: false
    });
  }

  return cfg;
}, (err) => Promise.reject(err));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
