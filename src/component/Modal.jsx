import ReactModal from "react-modal";
import { useState } from "react";


const MyModal = ({ isOpen, onClose, onEdit }) => {
    const [value, setValue] = useState("");

    const handleSave = () => {
        if (!value.trim()) return;

        onEdit({
            type: value,
            description: ""
        });

        setValue("");
        onClose();
    };

    return (
        <ReactModal isOpen={isOpen} onRequestClose={onClose}>
            <div className="modalcontainer">
                <div className="container">
                    <h3>Add a new Vulnerability</h3></div>

                <div className="flexcolumn">
                    <input className="inputstyle"
                        type="text"
                        maxLength={256}
                        placeholder="Enter up to 256 characters..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <div className="flexrow">
                        <button className="bouton" onClick={onClose}>Close</button>
                        <button className="bouton" onClick={handleSave} >Save</button>
                    </div>

                </div>
            </div>
        </ReactModal>
    );
}

export default MyModal;