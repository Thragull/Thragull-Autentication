import { jwtDecode } from "jwt-decode";

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            logged: false,
            signupError: null,
            loginError: null,
            token: null,
            userName: null
        },
        actions: {
            signup: async (body) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + '/api/signup', {
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ signupError: null });
                        return data;
                    } else {
                        setStore({ signupError: data.msg });
                        throw new Error(data.msg);
                    }
                } catch (err) {
                    setStore({ signupError: err.message });
                    console.error(err);
                }
            },
            login: async (body) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + '/api/login', {
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ logged: true, userName: data.user, loginError: null });
                        sessionStorage.setItem("token", data.token);
                        return data;
                    } else {
                        setStore({ loginError: data.msg });
                        throw new Error(data.msg);
                    }
                } catch (err) {
                    setStore({ loginError: err.message });
                    console.error(err);
                }
            },
            logout: () => {
                setStore({ logged: false, userName: null });
                sessionStorage.removeItem("token");
            },
            checkLoggedIn: () => {
                const token = sessionStorage.getItem("token");
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const user = decodedToken.sub;  // Assuming the username is in the token payload
                    setStore({ logged: true, userName: user });
                }
            },
            verifyToken: async () => {
                const token = sessionStorage.getItem("token");
                if (token) {
                    try {
                        const response = await fetch(process.env.BACKEND_URL + '/api/protected', {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });
                        const data = await response.json();
                        if (response.ok) {
                            setStore({ logged: true, userName: data.user.email });
                            return true;
                        } else {
                            setStore({ logged: false, userName: null });
                            sessionStorage.removeItem("token");
                            return false;
                        }
                    } catch (err) {
                        setStore({ logged: false, userName: null });
                        sessionStorage.removeItem("token");
                        console.error(err);
                        return false;
                    }
                } else {
                    setStore({ logged: false, userName: null });
                    return false;
                }
            }
        }
    };
};

export default getState;
