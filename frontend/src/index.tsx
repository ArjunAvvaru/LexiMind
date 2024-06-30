import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { GlobalStateProvider } from './store/provider'
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <GlobalStateProvider>
    <BrowserRouter>
      <App />
    </ BrowserRouter>
  </GlobalStateProvider>
)
