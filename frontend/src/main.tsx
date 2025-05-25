import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('main.tsx executing');

const container = document.getElementById('root');
console.log('Root element:', container);

if (!container) {
  console.error('Failed to find the root element');
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);
console.log('Root created');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 