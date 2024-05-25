import React from 'react'
import { Online, Offline } from 'react-detect-offline'
import { Alert } from 'antd'
import ReactDOM from 'react-dom/client'

import App from './components/app/app'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Online>
      <App className="app" />
    </Online>
    <Offline>
      <div className="offline">
        <Alert
          type="error"
          message="Sorry, the site is unavailable due to connection issues. Please check your internet connection and refresh the page"
        />
      </div>
    </Offline>
  </React.StrictMode>
)
