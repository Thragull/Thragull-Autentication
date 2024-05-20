import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<header className="jumbotron jumbotron-fluid text-center text-white d-flex align-items-center justify-content-center">
				<div className="container">
					<h1 className="display-4">JWT Authentication with Flask and React.js</h1>
					<p className="lead">A secure and modern system for user authentication.</p>
					<a href="#about" className="btn btn-primary btn-lg">Learn More</a>
				</div>
			</header>

			<section id="about" className="py-5">
				<div className="container">
					<div className="row">
						<div className="col-md-6">
							<h2>About the Project</h2>
							<p>This project aims to implement a user authentication system using JSON Web Tokens (JWT) in a modern development environment with Flask and React.js. It ensures information security and provides a smooth user experience.</p>
						</div>
						<div className="col-md-6">
							<img id="projectImg" src="https://res.cloudinary.com/ddlxctjxo/image/upload/v1716196220/Projects%20IMGs/_eafbf886-a476-4a64-9836-b5c59533794c_leujsy.jpg" alt="Project Diagram" className="img-fluid" />
						</div>
					</div>
				</div>
			</section>

			<section id="features" className="py-5">
				<div className="container">
					<div className="row text-center">
						<div className="col-md-4">
							<i className="fas fa-user-plus fa-3x mb-3"></i>
							<h3>User Registration</h3>
							<p>Allows users to register quickly and securely.</p>
						</div>
						<div className="col-md-4">
							<i className="fas fa-sign-in-alt fa-3x mb-3"></i>
							<h3>Login</h3>
							<p>Efficient and secure authentication for all registered users.</p>
						</div>
						<div className="col-md-4">
							<i className="fas fa-shield-alt fa-3x mb-3"></i>
							<h3>Validation and Security</h3>
							<p>Ensures that only authenticated users can access private content.</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};
