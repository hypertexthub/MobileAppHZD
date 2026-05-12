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
            console.log('Success!Logged out');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (

        <div className='navigation flexrow'>
            <button className='svgicon  bouton' onClick={() => navigate('/')}>
                <img className='buttonimagesize' src="/src/assets/images/bouton1.svg" alt="All machines" />
            </button>

            <button className='svgicon bouton ' onClick={() => navigate('/favorites')}>
                <img className='buttonimagesize' src="/src/assets/images/bouton2.svg" alt="Favorites" />
            </button>

            <button className='svgicon bouton ' onClick={handleLogout}>
                <img className='buttonimagesize' src="/src/assets/images/bouton3.svg" alt="Logout" />
            </button>
        </div>
    );
};

export default Nav;