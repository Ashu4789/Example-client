import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { serverEndpoint } from "../config/appConfig";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/action";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;

        if (formData.name.length === 0) {
            newErrors.name = "Name is required";
            isValid = false;
        }

        if (formData.email.length === 0) {
            newErrors.email = "Email is required";
            isValid = false;
        }

        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            try {
                const body = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                };
                const config = { withCredentials: true };
                const response = await axios.post(
                    `${serverEndpoint}/auth/register`,
                    body,
                    config
                );

                // Auto-login (or just set user state if backend returns it)
                // The register endpoint returns user info now.
                dispatch({
                    type: SET_USER,
                    payload: response.data.user,
                });

                setMessage("Registration successful!");
                navigate("/dashboard");

            } catch (error) {
                console.log(error);
                if (error.response && error.response.status === 400) {
                    setErrors({
                        message: error.response.data.message || "Registration failed",
                    });
                } else {
                    setErrors({
                        message: "Something went wrong, please try again",
                    });
                }
            }
        }
    };

    const handleGoogleSuccess = async (authResponse) => {
        try {
            const body = {
                idToken: authResponse?.credential,
            };
            const response = await axios.post(
                `${serverEndpoint}/auth/google-auth`,
                body,
                { withCredentials: true }
            );
            dispatch({
                type: SET_USER,
                payload: response.data.user,
            });
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
            setErrors({
                message: "Unable to process google sso, please try again",
            });
        }
    };

    const handleGoogleFailure = (error) => {
        console.log(error);
        setErrors({
            message:
                "Something went wrong while performing google single sign-on",
        });
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    {/* Main Card */}
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="card-body p-5">
                            {/* Brand Header */}
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-dark">
                                    Create <span className="text-primary">Account</span>
                                </h2>
                                <p className="text-muted">
                                    Join MergeMoney to manage your expenses
                                </p>
                            </div>

                            {/* Global Alerts */}
                            {(message || errors.message) && (
                                <div className={`alert ${message ? 'alert-success' : 'alert-danger'} py-2 small border-0 shadow-sm mb-4`}>
                                    <i className={`bi ${message ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                                    {message || errors.message}
                                </div>
                            )}

                            <form onSubmit={handleFormSubmit} noValidate>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">
                                        Full Name
                                    </label>
                                    <input
                                        className={`form-control form-control-lg rounded-3 fs-6 ${errors.name ? "is-invalid" : ""
                                            }`}
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        onChange={handleChange}
                                    />
                                    {errors.name && (
                                        <div className="invalid-feedback">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">
                                        Email Address
                                    </label>
                                    <input
                                        className={`form-control form-control-lg rounded-3 fs-6 ${errors.email ? "is-invalid" : ""
                                            }`}
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-secondary">
                                        Password
                                    </label>
                                    <input
                                        className={`form-control form-control-lg rounded-3 fs-6 ${errors.password ? "is-invalid" : ""
                                            }`}
                                        type="password"
                                        name="password"
                                        placeholder="Create a password"
                                        onChange={handleChange}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}
                                    <div className="text-end mt-1">
                                        <Link
                                            to="/login"
                                            className="text-primary small text-decoration-none fw-bold"
                                        >
                                            Already have an account? Login
                                        </Link>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-primary w-100 btn-md rounded-pill fw-bold shadow-sm mb-4">
                                        Sign Up
                                    </button>
                                </div>
                            </form>

                            {/* Divider */}
                            <div className="d-flex align-items-center my-2">
                                <hr className="flex-grow-1 text-muted" />
                                <span className="mx-3 text-muted small fw-bold">
                                    OR
                                </span>
                                <hr className="flex-grow-1 text-muted" />
                            </div>

                            {/* Google Social SignUp */}
                            <div className="d-flex justify-content-center w-100">
                                <GoogleOAuthProvider
                                    clientId={
                                        import.meta.env.VITE_GOOGLE_CLIENT_ID
                                    }
                                >
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleFailure}
                                        theme="outline"
                                        shape="pill"
                                        text="signup_with"
                                        width="500"
                                    />
                                </GoogleOAuthProvider>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;