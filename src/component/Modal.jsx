import ReactModal from "react-modal";
import { useState } from "react";


const MyModal = ({ isOpen, onClose, onEdit }) => {
    const [value, setValue] = useState("");


    return (
        <ReactModal isOpen={isOpen} onRequestClose={onClose}>
            <h2>Add a new Vulnerability</h2>
            <div>
                <input className="inputstyle"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div>
                    <button onClick={onClose}>Close</button>
                    {/* <button onclick={handleSave} >Save</button> */}
                </div>

            </div>
        </ReactModal>
    );
}

export default MyModal;

// function MyModal({ isOpen, onClose }) {
//     return (
//         <Modal isOpen={isOpen} onRequestClose={onClose}>
//             <h2>My Modal</h2>
//             <button onClick={onClose}>Close</button>
//         </Modal>
//     );
// }