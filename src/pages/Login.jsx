import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import logo from '../assets/OQ.png';
import '../assets/Login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // ✅ Initialize navigate

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            console.error(err.message);
            setError("Invalid email or password");
        }
    };

    return (
        <div className="login">
            <div className="main">
                <div className="login-left">
                    <img src={logo} alt="Oqulix Logo" />
                    <h3>Oqulix Product Management</h3>
                    <h3 className="loginText">Login</h3>
                    {error && <p style={{color:'red'}} className="error-message">{error}</p>}

                </div>

                <div className="login-right">
                    <form className="login-form" onSubmit={handleLogin}>                        
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>

                        <label>
                            Password:
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>

                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
