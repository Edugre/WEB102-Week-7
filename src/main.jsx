import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.jsx'
import Dashboard from './components/Dashboard.jsx'
import Game from './components/Game.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} >
          <Route index element={<Dashboard />} />
          <Route path='game/:id' element={<Game />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
