import { useState } from 'react'
import SignUp from './pages/SignUp'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Routes, Route } from "react-router-dom"
import Option from './pages/Option';


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}  ></Route>
        <Route path="/register" element={<SignUp />}  ></Route>
        <Route path="/option" element={<Option />}  ></Route>

      </Routes>
    </>
  )
}

export default App
