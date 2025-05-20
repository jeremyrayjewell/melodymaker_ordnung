import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';    // Then our custom BIOS styles
import './index.css';        // Keep original styles as fallback
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);