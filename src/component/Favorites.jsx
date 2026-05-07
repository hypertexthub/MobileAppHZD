import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
    const [machines, setMachines] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5001/favorites`,
                    { credentials: "include" }
                );

                const data = await res.json();
                setMachines(data);
            } catch (err) {
                console.error("Failed to load favorites", err);
            }
        };


        fetchFavorites();

    }, []);
    return (
        <div className="favorites-container">
            <h2>My Favorites</h2>

            {(Array.isArray(machines) ? machines : []).length === 0 ? (
                <p>No favorites yet.</p>
            ) : (
                <div className="favorites-grid">

                    {(Array.isArray(machines) ? machines : []).map((machine) => (
                        <div
                            key={machine.id}
                            className="favorite-card"
                        >

                            {machine.main_image && (
                                <img
                                    src={machine.main_image}
                                    alt={machine.name}
                                    className="favorite-image"
                                />
                            )}

                            <h3>{machine.name}</h3>

                            <p>{machine.class}</p>
                            <p>{machine.size_weight}</p>
                            <p>{machine.weakness}</p>

                            <button
                                onClick={() =>
                                    navigate(`/machine/${machine.id}`)
                                }
                            >
                                See more
                            </button>

                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default Favorites;