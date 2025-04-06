import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from "react-router";
import Plinko from './games/Plinko';
import Chicken from './games/Chicken';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/Home' element={<Home />} />

        {/* Game Routes */}
        <Route path='/Plinko' element={<Plinko />} />
        <Route path='/Chicken' element={<Chicken />} />
        {/* <Route path='/Plinko' element={<Slots />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
