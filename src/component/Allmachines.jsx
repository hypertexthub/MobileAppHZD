import Button from './Button'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Allmachines = () => {
    const navigate = useNavigate();
    const [machines, setMachines] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5001/machines")
            .then(res => res.json())
            .then(data => setMachines(data))
            .catch(err => console.error(err));
    }, []);


    return (
        <div className="flexrow">
            {(Array.isArray(machines) ? machines : []).map((machine) => (
                <div className="flexcolumn" key={machine.id}>
                    <h3>{machine.name}</h3>

                    <img
                        src={machine.main_image || "no image"}
                        alt={machine.name}
                        className='mainimage'
                    />

                    <Button
                        text="View"
                        color=""
                        onClick={() => navigate(`/machine/${machine.id}`)}
                    />
                </div>
            ))}
        </div>
    );
};

export default Allmachines;
