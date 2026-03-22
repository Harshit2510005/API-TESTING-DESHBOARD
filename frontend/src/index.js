import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // सुनिश्चित करें कि App.js src के अंदर ही है
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);