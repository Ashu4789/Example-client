import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/appConfig";
import { useDispatch } from "react-redux";
import { SET_USER } from "../../redux/user/action";

function SetPasswordModal({ user, onHide }) {
    const dispatch = useDispatch();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                `${serverEndpoint}/auth/set-password`,
                { password },
                { withCredentials: true }
            );

            // Update user state to reflect they now have a password
            dispatch({
                type: SET_USER,
                payload: { ...user, hasPassword: true },
            });

            if (onHide) onHide();
        } catch (err) {
            console.error(err);
            setError("Failed to set password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 shadow">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Set a Password</h5>
                        {/* Prevent closing without setting password if critical, or allow skip? 
                            User request implies they should be "recommended" to set a password. 
                            We'll add a skip/close button. */}
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body p-4">
                        <p className="text-muted mb-4">
                            You logged in with Google. We recommend setting a password so you can also log in with your email address in the future.
                        </p>

                        {error && <div className="alert alert-danger py-2 small">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-primary rounded-pill fw-bold" disabled={loading}>
                                    {loading ? "Setting Password..." : "Set Password"}
                                </button>
                                <button type="button" className="btn btn-light rounded-pill text-muted sm" onClick={onHide}>
                                    Skip for now
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetPasswordModal;
