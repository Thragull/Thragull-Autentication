import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Context } from "../store/appContext";
import "../../styles/Register.css"

export const Register = () => {
	const { store, actions } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [successMessage, setSuccessMessage] = useState("");
	const navigate = useNavigate(); 

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validatePassword = (password) => {
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		return passwordRegex.test(password);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		let validationErrors = {};

		if (!validateEmail(email)) {
			validationErrors.email = "Please enter a valid email address.";
		}

		if (!validatePassword(password)) {
			validationErrors.password = "Password must be at least 8 characters long, contain uppercase and lowercase letters, a digit, and a special character.";
		}

		if (password !== confirmPassword) {
			validationErrors.confirmPassword = "Passwords do not match.";
		}

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
		} else {
			const body = { email, password };
			try {
				const data = await actions.signup(body);
				if (data) {
					setSuccessMessage("Registration successful! Redirecting to login...");
					setEmail("");
					setPassword("");
					setConfirmPassword("");
					setErrors({});
					setTimeout(() => {
						navigate("/login");
					}, 2000); 
				}
			} catch (err) {
				setErrors({ apiError: store.signupError });
			}
		}
	};

	useEffect(() => {
		if (store.signupError) {
			setErrors({ apiError: store.signupError });
		}
	}, [store.signupError]);

	return (
		<div className="register container mt-5">
			<h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">Email address</label>
					<input 
						type="email" 
						className={`form-control ${errors.email ? "is-invalid" : ""}`} 
						id="email" 
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					{errors.email && <div className="invalid-feedback">{errors.email}</div>}
				</div>
				<div className="mb-3">
					<label htmlFor="password" className="form-label">Password</label>
					<input 
						type="password" 
						className={`form-control ${errors.password ? "is-invalid" : ""}`} 
						id="password" 
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{errors.password && <div className="invalid-feedback">{errors.password}</div>}
				</div>
				<div className="mb-3">
					<label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
					<input 
						type="password" 
						className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} 
						id="confirmPassword" 
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					{errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
				</div>
				{errors.apiError && <div className="alert alert-danger">{errors.apiError}</div>}
				{successMessage && <div className="alert alert-success">{successMessage}</div>}
				<button type="submit" className="btn">Register</button>
			</form>
		</div>
	);
};
