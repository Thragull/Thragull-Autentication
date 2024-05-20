import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { Context } from "../store/appContext";
import "../../styles/Login.css";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({}); 

        const body = { email, password };
        try {
            const data = await actions.login(body);
            if (data) {
                navigate("/protected");
            }
        } catch (err) {
            setErrors({ apiError: store.loginError });
        }
    };

    return (
        <div className="login container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input 
                        type="email" 
                        className={`form-control ${errors.apiError ? "is-invalid" : ""}`} 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                        type="password" 
                        className={`form-control ${errors.apiError ? "is-invalid" : ""}`} 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {errors.apiError && <div className="alert alert-danger">{errors.apiError}</div>}
                <button type="submit" className="btn">Login</button>
            </form>
        </div>
    );
};
