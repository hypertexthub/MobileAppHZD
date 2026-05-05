import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Header from './component/Header'
import Filters from './component/Filters'
import Allmachines from './component/Allmachines'
import Singlemachine from './component/Singlemachine'
import Footer from './component/Footer'
import ReactModal from "react-modal"
ReactModal.setAppElement("#root")

function App() {

  return (

    <div className=''>
      <Router>
        <Header />
        <Filters />
        <Routes>
          <Route path="/" element={<Allmachines />} />
          <Route path="/machine/:id" element={<Singlemachine />} />
        </Routes>
        <Footer />
      </Router>
    </div>

  );
}

export default App
