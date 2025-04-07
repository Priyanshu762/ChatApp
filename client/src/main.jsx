import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import AppWrapper from './components/common/AuthWrapper.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AppWrapper />
      </ThemeProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </Provider>
  </StrictMode>,
)
