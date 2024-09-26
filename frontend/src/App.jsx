import { useState, useEffect } from 'react'
import SignUp from './pages/SignUp'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Routes, Route } from "react-router-dom"
import Option from './pages/Option';
import InvoiceForm from './pages/InvoiceForm';
import View from './pages/View'
import UpdateForm from "./pages/UpdateForm";
import InvoicePage from './pages/InvoicePage';
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    localStorage.clear();
  }, [])
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}  ></Route>
        <Route path="/register" element={<SignUp />}  ></Route>
        <Route path="/option" element={<Option />}  ></Route>
        <Route path="/create" element={<InvoiceForm />}  ></Route>
        <Route path="/view" element={<View />}  ></Route>
        <Route path="/updateForm" element={<UpdateForm />}  ></Route>
        <Route path="/check" element={<InvoicePage />}  ></Route>
      </Routes>
    </>
  )
}

export default App
