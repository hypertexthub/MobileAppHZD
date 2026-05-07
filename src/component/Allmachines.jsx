import Button from './Button'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";



const Allmachines = () => {
    const navigate = useNavigate();
    const [machines, setMachines] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5001/machines", {
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch machines");
                return res.json();
            })
            .then(data => setMachines(data))
            .catch(err => console.error(err));
    }, []);


    // GET FAVORITES (to know which are starred)
    useEffect(() => {
        fetch("http://localhost:5001/favorites", {
            credentials: "include"
        })
            .then(async (res) => {
                if (!res.ok) return [];
                return res.json();
            })
            .then(data => setFavorites(data))
            .catch(err => console.error(err));
    }, []);

    const isFavorite = (id) => {
        return favorites.some(fav => fav.id === id);
    };

    const toggleFavorite = async (machineId) => {
        const exists = isFavorite(machineId);

        if (exists) {
            await fetch(
                `http://localhost:5001/favorites/${machineId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            setFavorites(prev =>
                prev.filter(f => f.id !== machineId)
            );
        } else {
            await fetch(
                `http://localhost:5001/favorites/${machineId}`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            const machine = machines.find(m => m.id === Number(machineId));
            setFavorites(prev => [...prev, machine]);
        }
    };

    return (

        <div className="containerAllmachines">
            <div className="flexrow">
                {(Array.isArray(machines) ? machines : []).map((machine) => (
                    <div className="flexcolumn" key={machine.id}>
                        <h3>{machine.name}</h3>
                        <FaStar
                            onClick={() => toggleFavorite(machine.id)}
                        />

                        <img
                            src={machine.main_image || "no image"}
                            alt={machine.name}
                            className='mainimage'
                        />

                        <div className='textalign'>

                            <Button
                                className='bouton'
                                text="View"
                                onClick={() => navigate(`/machine/${machine.id}`)}
                            />
                        </div>


                    </div>
                ))}
            </div>

        </div>
    );
};



export default Allmachines;
