import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateUser() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();



    const register = async () => {

        const isValidEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        };

        if (!isValidEmail(email)) {
            alert("Please enter a valid email");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        try {

            const response = await fetch("http://localhost:5001/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed");
                return;
            }

            alert("Account created successfully!");

            // back to log in
            navigate("/login");

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>

            <h1>Create Account</h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={register}>
                Create Account
            </button>

        </div>
    );
}

export default CreateUser;