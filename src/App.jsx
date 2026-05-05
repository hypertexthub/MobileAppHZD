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

  const addVulnerability = (machineId, newVuln) => {
    const [machines, setMachines] = useState([]);
    const updatedMachines = machines.map(machine => {
      if (machine.id === machineId) {
        return {
          ...machine,
          vulnerabilities: [
            ...machine.vulnerabilities,
            newVuln
          ]
        };
      } else {
        return machine;
      }
    });

    setMachines(updatedMachines);
  };


  return (

    <div className=''>
      <Router>
        <Header />
        <Filters />

        <Routes>
          <Route path="/" element={<Allmachines />} />
          {/* <Route path="/machine/:id" element={<Singlemachine machines={machines} onEdit={addVulnerability} />} /> */}
        </Routes>
        <Footer />
      </Router>
    </div>

  );
}

export default App
