import Button from './Button'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const Allmachines = ({ search }) => {
    const navigate = useNavigate();
    const [machines, setMachines] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                let url = "http://localhost:5001/machines";

                // if search has text, use search endpoint
                if (search && search.trim() !== "") {
                    url = `http://localhost:5001/machines/search/${encodeURIComponent(search)}`;
                }

                const res = await fetch(url, {
                    credentials: "include"
                });
                const data = await res.json();

                setMachines(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMachines();
    }, [search]);


    //mes favorites
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
            <div className="containerfav">
                <h3>All Units</h3>
            </div>
            <div className="flexrow">
                {(Array.isArray(machines) ? machines : []).map((machine) => (
                    <div className="flexcolumn allmachinescard" key={machine.id}>
                        <h3>{machine.name}</h3>

                        <button
                            className="favorite-btn"
                            onClick={() => toggleFavorite(machine.id)}
                        >
                            {isFavorite(machine.id) ? (
                                <FaStar className="star filled" />
                            ) : (
                                <FaRegStar className="star empty" />
                            )}
                        </button>


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