import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ fetchUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    const login = async () => {
        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Please enter a valid email");
            return;
        }

        const res = await fetch("http://localhost:5001/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            alert("Invalid email or password");
            return;
        }

        await fetchUser();
        navigate("/");
    };

    const goToRegister = () => {
        navigate("/register");
    };

    return (
        <div>
            <h1>Login</h1>

            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />

            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
            />

            <button onClick={login}>Login</button>
            <button onClick={goToRegister}>Create Account</button>
        </div>
    );
}

export default Login;