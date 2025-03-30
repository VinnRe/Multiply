import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from "react-router";
import Games from './pages/Games';
import Plinko from './games/Plinko';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/*  */}
        <Route path='/' element={<Home />} />
        <Route path='/Home' element={<Home />} />
        <Route path='/Games' element={<Games />} />

        {/* Add Game Routes */}
        <Route path='/Plinko' element={<Plinko />} />
        {/* <Route path='/Plinko' element={<Slots />} />
        <Route path='/Plinko' element={<Chicken />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
