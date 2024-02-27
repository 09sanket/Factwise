import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.tsx';


const root = document.getElementById('root');

if (root) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    root
  );
}


