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

        <div className="containerAllmachines">
            <div className="containerfav">
                <h3>My Favorites</h3>
            </div>

            <div className="flexrow">

                {(Array.isArray(machines) ? machines : []).length === 0 ? (
                    <p>No favorites yet.</p>
                ) : (
                    <div className="flexrow">

                        {(Array.isArray(machines) ? machines : []).map((machine) => (

                            <div className="favoritescard">

                                <div
                                    key={machine.id}
                                    className=""
                                >
                                    <div className="container">
                                        <h3>{machine.name}</h3>
                                    </div>

                                    {machine.main_image && (
                                        <img
                                            src={machine.main_image}
                                            alt={machine.name}
                                            className="mainimage"
                                        />
                                    )}

                                    <p><strong>Class:</strong> {machine.class}</p>
                                    <p><strong>Size:</strong> {machine.size_weight}</p>
                                    <p><strong>Weakness:</strong> {machine.weakness}</p>

                                    <button className="bouton"
                                        onClick={() =>
                                            navigate(`/machine/${machine.id}`)
                                        }
                                    >
                                        See more
                                    </button>

                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;