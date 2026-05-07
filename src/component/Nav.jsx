import Button from './Button'
import { useNavigate } from "react-router-dom";

const Nav = ({ setUser }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5001/logout", {
                method: "POST",
                credentials: "include",
            });

            setUser(null);
            navigate("/login");
            console.log('Success...Logged out');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className='navigation flexrow'>
            <Button
                text="All machines"
                onClick={() => navigate(`/`)}
            />

            <Button
                text="Logout"
                onClick={handleLogout}
            />
        </div>
    );
};

export default Nav;