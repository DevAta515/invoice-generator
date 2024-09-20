import { useState } from 'react'
import SignUp from './pages/SignUp'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Routes, Route } from "react-router-dom"


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}  ></Route>
        <Route path="/register" element={<SignUp />}  ></Route>
      </Routes>
    </>
  )
}

export default App
