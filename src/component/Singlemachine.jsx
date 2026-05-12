import { useParams } from "react-router-dom";
import Button from './Button'
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import MyModal from "./Modal";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";


const Singlemachine = ({ machines, onEdit }) => {


    const fileRef = useRef(null);
    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            alert("Only JPG or PNG allowed");
            return;
        }

        if (file.size > 999 * 1024) {
            alert("File too large (max 1000KB)");
            return;
        }

        try {

            const formData = new FormData();
            formData.append("image", file);
            formData.append("category", "PS5");

            const res = await fetch(
                `http://localhost:5001/machines/${id}/images`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || "Upload failed");
            }

            if (!data?.image) {
                throw new Error("Invalid server response");
            }

            setMachine(prev => ({
                ...prev,
                images: [...(prev?.images || []), data.image]
            }));

        } catch (err) {
            console.error(err);
            alert("Image upload failed");
        }
    };

    const [isOpen, setIsOpen] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const [machine, setMachine] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5001/machines/${id}`, {
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch machine");
                return res.json();
            })
            .then(data => setMachine(data))
            .catch(err => console.error(err));

    }, [id]);

    if (!machine) return <p>Loading...</p>;

    //adding vulnerability

    const handleAddVulnerability = (newVuln) => {
        fetch(`http://localhost:5001/machines/${id}/vulnerabilities`, {
            credentials: "include",
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
        fetch(`http://localhost:5001/machines/${machine.id}/vulnerabilities/${vulnId}`, {
            credentials: "include",
            method: "DELETE"
        })
            .then(() => {
                setMachine(prev => ({
                    ...prev,
                    vulnerabilities: prev.vulnerabilities.filter(v => v.id !== vulnId)
                }));
            })
            .catch(err => console.error(err));
    };

    const handleDeleteImage = async (imageId) => {
        const res = await fetch(
            `http://localhost:5001/machines/${id}/images/${imageId}`,
            {
                credentials: "include",
                method: "DELETE"

            }
        );

        if (!res.ok) return;

        setMachine(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== imageId)
        }));
    };

    return (
        <div className="containersinglemachine">

            <div className="container">
                <h3>{machine.name}</h3>
            </div>

            <div>
                <img
                    src={machine.main_image}
                    alt={machine.name}
                    className='mainimageSingle'
                />

                <div className="aspects">
                    <h4>Aspects</h4>
                    <div className="flexrowaspects">
                        <p><strong>Class: </strong>{machine.class}</p>
                        <p><strong>Size: </strong>{machine.size_weight}</p>
                        <p><strong>Weakness: </strong>{machine.weakness}</p>
                        <p><strong>Strength: </strong>{machine.strength}</p>
                    </div>
                </div>

            </div>

            <div className="flexrowinfo">
                <div className="attackscontainer">
                    <div> <h4>Attacks</h4></div>
                    <div className="attacksborder">

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
                </div>


                <div className="vulnerabilitiescontainer">
                    <div className="flexrregular">
                        <div><h4>Vulnerabilities</h4></div>
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
                <div className="containerupload"> <h4>Upload your PS5 Images</h4></div>


                <button className="buttonedit" onClick={() => fileRef.current.click()}>
                    <FaPlus className="icons" />
                </button>

                <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                />
            </div>

            <div className="containerImages">
                <div className="">

                    {machine.images && machine.images.length > 0 ? (
                        machine.images.map((img) => (
                            <div key={img.id} className="imagesMachine flexcolumn">
                                <img className="secondaryimg"
                                    src={img.image_url}
                                    alt="machine"
                                />
                                <button className="buttonedit" onClick={() => handleDeleteImage(img.id)}>
                                    <div className="">
                                        <FaTrash className="icons " />
                                    </div>
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No images available</p>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Singlemachine;