import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './css/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Toaster
      toastOptions={{
        className: 'border-2 border-black rounded text-black',
      }}
    />
    <App />
  </React.StrictMode>,
);
