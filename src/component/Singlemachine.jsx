import { useParams } from "react-router-dom";
import Button from './Button'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import Modal from "./Modal";
import MyModal from "./Modal";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

const Singlemachine = ({ machines, onEdit }) => {

    const [isOpen, setIsOpen] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const [machine, setMachine] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5001/machines/${id}`)
            .then(res => res.json())
            .then(data => setMachine(data));

        fetch(`http://localhost:5001/machines/${id}/attacks`)
            .then(res => res.json())
            .then(data => setMachine(prev => ({ ...prev, attacks: data })));

        fetch(`http://localhost:5001/machines/${id}/vulnerabilities`)
            .then(res => res.json())
            .then(data => setMachine(prev => ({ ...prev, vulnerabilities: data })));
    }, [id]);

    if (!machine) return <p>Loading...</p>;

    //adding vulnerability

    const handleAddVulnerability = (newVuln) => {
        fetch(`http://localhost:5001/machines/${id}/vulnerabilities`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newVuln)
        })
            .then(() => window.location.reload())
            .catch(err => console.error(err));
    };

    //deleting vunerability
    const handleDeleteVulnerability = (vulnId) => {
        fetch(`http://localhost:5001/vulnerabilities/${vulnId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                machine_id: machine.id
            })
        })
            .then(() => window.location.reload())
            .catch(err => console.error(err));
    };

    return (
        <div className="">

            <div>
                <Button text="All machines" color="" onClick={() => navigate(`/`)} />
            </div>
            <h2>{machine.name}</h2>

            <img
                src={machine.main_image}
                alt={machine.name}
                className='mainimageSingle'
            />

            <div className="flexrowinfo">

                <div className="aspects">
                    <h4>Aspects</h4>
                    <p><strong>Class: </strong>{machine.class}</p>
                    <p><strong>Size: </strong>{machine.size_weight}</p>
                    <p><strong>Weakness: </strong>{machine.weakness}</p>
                    <p><strong>Strength: </strong>{machine.strength}</p>
                </div>

                <div className="">
                    <h4>Attacks</h4>
                    {machine.attacks && machine.attacks.length > 0 ? (
                        machine.attacks.map((attack, index) => (
                            <div key={index}>
                                <p> {attack.type}</p>
                            </div>
                        ))
                    ) : (
                        <p>No attacks available</p>
                    )}
                </div>

                <div className="">
                    <div className="flexrregular">
                        <h4>Vulnerabilities</h4>
                        <button className="buttonedit">
                            <FaPlus className="icons" onClick={() => setIsOpen(true)}
                            />
                        </button>
                        <MyModal isOpen={isOpen} onClose={() => setIsOpen(false)} onEdit={handleAddVulnerability} />
                    </div>
                    <div className="vulnerabilities">
                        {machine.vulnerabilities && machine.vulnerabilities.length > 0 ? (
                            machine.vulnerabilities.map((vulnerability, index) => (
                                <div className="flexrregularvul" key={index}>
                                    <p>{vulnerability.type}</p>
                                    <button className="buttonedit" onClick={() => handleDeleteVulnerability(vulnerability.id)}>
                                        <FaTrash className="icons" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No vulnerabilities available</p>

                        )}


                    </div>
                </div>

            </div>

            <div>
                <h4>Upload your PS5 Images:</h4>
            </div>
        </div>
    )
}

export default Singlemachine;
