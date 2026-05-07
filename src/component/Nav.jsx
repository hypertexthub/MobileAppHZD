import Button from './Button'
import { useNavigate } from "react-router-dom";

const Nav = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5001/logout", {
                method: "POST",
                credentials: "include",
            });

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



// import Button from './Button'
// import { useNavigate } from "react-router-dom";

// const handleLogout = async () => {
//     try {
//         await fetch("http://localhost:5001/logout", {
//             method: "POST",
//             credentials: "include",
//         });

//         navigate("/login");
//     } catch (err) {
//         console.error("Logout failed", err);
//     }
// };



// const Nav = ({ text, onClick, className = '' }) => {
//     const navigate = useNavigate();
//     return (

//         <div className='navigation flexrow'>
//             <Button text="All machines" className="" onClick={() => navigate(`/`)} />
//             <Button text="Logout" className="" onClick={handleLogout} />


//         </div>


//     )
// }

// export default Nav