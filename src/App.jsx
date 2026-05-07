import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Header from './component/Header'
import Filters from './component/Filters'
import Allmachines from './component/Allmachines'
import Singlemachine from './component/Singlemachine'
import Footer from './component/Footer'
import Login from './component/Login'
import Createuser from "./component/Createuser"
import ReactModal from "react-modal"
import Nav from "./component/Nav"

ReactModal.setAppElement("#root")

function App() {

  return (

    <div className=''>
      <Router>
        <Header />
        <Nav />

        <Filters />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Createuser />} />
          <Route path="/" element={<Allmachines />} />
          <Route path="/machine/:id" element={<Singlemachine />} />
        </Routes>
        <Footer />
      </Router>
    </div>

  );
}

export default App
