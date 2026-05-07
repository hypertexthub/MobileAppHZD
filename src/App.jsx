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
import Protectedroute from "./component/Protectedroute";
import Favorites from './component/Favorites'

ReactModal.setAppElement("#root")

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (

    <div className=''>
      <Router>

        {user && <Header setUser={setUser} />}
        {user && <Nav setUser={setUser} />}
        {user && <Filters setUser={setUser} />}
        <Routes>
          <Route path="/login" element={<Login fetchUser={fetchUser} />} />
          <Route path="/register" element={<Createuser />} />
          <Route
            path="/"
            element={
              <Protectedroute user={user}>
                <Allmachines />
              </Protectedroute>
            }
          />
          <Route
            path="/machine/:id"
            element={
              <Protectedroute user={user}>
                <Singlemachine />
              </Protectedroute>
            }
          />
          <Route
            path="/favorites"
            element={
              <Protectedroute user={user}>
                <Favorites />
              </Protectedroute>
            }
          />

        </Routes>
        <Footer />
      </Router>
    </div>

  );
}

export default App
