import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Header from './component/Header'
import Filters from './component/Filters'
import Allmachines from './component/Allmachines'
import Singlemachine from './component/Singlemachine'
import Footer from './component/Footer'
import Login from './component/Login'
import Createuser from "./component/Createuser"
import Nav from "./component/Nav"
import ReactModal from "react-modal"



ReactModal.setAppElement("#root")

function App() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5001/profile", {
        credentials: "include"
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);


  return (

    <div className=''>
      <Router>
        <Header />
        {user && <Nav setUser={setUser} />}

        <Filters />
        <Routes>
          <Route path="/login" element={<Login fetchUser={fetchUser} />} />
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
