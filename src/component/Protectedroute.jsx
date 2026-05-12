import { Navigate } from "react-router-dom";

function Protectedroute({ user, children }) {

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
export default Protectedroute;