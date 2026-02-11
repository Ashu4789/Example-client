import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post(`${serverEndpoint}/auth/reset-password`, {
                token,
                password,
            });
            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 3000);
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
                                <h2 className="fw-bold text-dark">Reset <span className="text-primary">Password</span></h2>
                                <p className="text-muted">Enter your new password below</p>
                            </div>

                            {message && <div className="alert alert-success">{message} Redirecting to login...</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg rounded-3 fs-6"
                                        placeholder="Min 3 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={3}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-secondary">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg rounded-3 fs-6"
                                        placeholder="Confirm your new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 btn-md rounded-pill fw-bold shadow-sm mb-3"
                                    disabled={loading}
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
