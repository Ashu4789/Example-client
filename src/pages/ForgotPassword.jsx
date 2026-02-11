import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { Link } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post(`${serverEndpoint}/auth/forgot-password`, { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-dark">Forgot <span className="text-primary">Password</span></h2>
                                <p className="text-muted">Enter your email to receive a reset link</p>
                            </div>

                            {message && <div className="alert alert-success">{message}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-secondary">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg rounded-3 fs-6"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 btn-md rounded-pill fw-bold shadow-sm mb-3"
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </button>
                                <div className="text-center">
                                    <Link to="/login" className="small text-decoration-none fw-bold">Back to Login</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
