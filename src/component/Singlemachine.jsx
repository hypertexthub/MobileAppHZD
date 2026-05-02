import { useParams } from "react-router-dom";
import Button from './Button'
import { useNavigate } from "react-router-dom";
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Singlemachine = ({ machines }) => {

    const { id } = useParams();
    const machine = machines.find((m) => m.id === Number(id));
    const navigate = useNavigate();

    return (
        <div className="">

            <div>
                <Button text="All machines" color="" onClick={() => navigate(`/`)} />
            </div>
            <h2>{machine.name}</h2>


            <img
                src={machine["main-image"]}
                alt={machine.name}
                className='mainimageSingle'
            />

            <div className="flexrowinfo">

                <div className="aspects">
                    <h4>Aspects:</h4>
                    <p><strong>Class: </strong>{machine.class}</p>
                    <p><strong>Size: </strong>{machine.size_weight}</p>
                    <p><strong>Weakness: </strong>{machine.weakness}</p>
                    <p><strong>Strength: </strong>{machine.strength}</p>
                </div>

                <div className="aspects">
                    <h4>Attacks:</h4>
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

                <div className="aspects">
                    <h4>Vulnerabilities:</h4>

                    {machine.vulnerabilities && machine.vulnerabilities.length > 0 ? (
                        machine.vulnerabilities.map((vulnerability, index) => (
                            <div key={index}>
                                <p>{vulnerability.type}</p>
                                {/* <p><strong>Description:</strong> {attack.description || "N/A"}</p> */}
                            </div>
                        ))
                    ) : (
                        <p>No attacks available</p>
                    )}
                    <Link to={``}>
                        <FaEdit className="icons" />
                    </Link>

                </div>

            </div>

            <div>
                <h4>Upload your PS5 Images:</h4>
            </div>
        </div>
    )
}

export default Singlemachine
