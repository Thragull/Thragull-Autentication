import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import LoadingSpinner from "./LoadingSpinner"; 
import "../../styles/Protected.css"

const Protected = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyAccess = async () => {
            try {
                const accessGranted = await actions.verifyToken();
                if (!accessGranted) {
                    navigate("/login");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        verifyAccess();
    }, []);

    if (loading) {
        return <LoadingSpinner />; // Muestra un spinner de carga mientras se verifica el acceso
    }

    if (error) {
        return <div>Error: {error}</div>; // Muestra un mensaje de error si ocurre algún problema
    }

    if (!store.logged) {
        return null; // Alternatively, you could show a loading spinner or message here
    }

    return (
        <div id="protectedContainer" className="container">
            <h1 id="protectedH1" className="my-4">Protected Page</h1>
            <p id="protectedP">Welcome {store.userName}, this is a protected page.</p>
        </div>
    );
};

export default Protected;